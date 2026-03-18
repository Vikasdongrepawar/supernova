const mongoose = require('mongoose');
const axios = require('axios');
const Cart = require('../models/Cart');

// ─────────────────────────────────────────────────────────
// HELPER — fetch a single product from the product service
// All product data (price, name, image, stock) comes from
// here — never from the cart document itself.
// ─────────────────────────────────────────────────────────
const fetchProduct = async (productId) => {
  const { data } = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`
  );
  return data;
};

// ─────────────────────────────────────────────────────────
// HELPER — build a rich cart response
// FIX (stale price): we call the product service for EVERY
// item on every GET. Price, name, image always reflect the
// current state of the product — never a stale snapshot.
//
// totalAmount is computed here in JS — never stored in DB.
// ─────────────────────────────────────────────────────────
const buildCartResponse = async (cart) => {
  const enrichedItems = await Promise.all(
    cart.items.map(async (item) => {
      try {
        const product = await fetchProduct(item.productId);
        return {
          productId:  item.productId,
          name:       product.name,
          price:      product.price,           // always live
          image:      product.images?.[0] || '',
          stock:      product.stock,
          quantity:   item.quantity,
          subtotal:   +(product.price * item.quantity).toFixed(2),
        };
      } catch {
        // Product may have been deleted — return a tombstone entry
        // so the cart doesn't silently lose items or crash
        return {
          productId: item.productId,
          name:      '[Product unavailable]',
          price:     0,
          quantity:  item.quantity,
          subtotal:  0,
          unavailable: true,
        };
      }
    })
  );

  const totalAmount = +enrichedItems
    .reduce((sum, i) => sum + i.subtotal, 0)
    .toFixed(2);

  return { ...cart.toObject(), items: enrichedItems, totalAmount };
};

// ─────────────────────────────────────────────────────────
// GET CART
// Always returns live-priced cart. Never reads price from DB.
// ─────────────────────────────────────────────────────────
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const response = await buildCartResponse(cart);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// ADD ITEM
// ─────────────────────────────────────────────────────────
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate productId is a real ObjectId before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const product = await fetchProduct(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // FIX 4 — use the model helper which uses .equals() internally
    const existingItem = cart.findItem(productId);

    // FIX 3 — cumulative stock check
    // Original only checked: product.stock < quantity (new qty only)
    // Bug: if 3 units already in cart and stock is 4, adding 2 passes
    //      the check (4 > 2 = true) but cart ends up with 5 > stock.
    const currentQty = existingItem ? existingItem.quantity : 0;
    const totalQty   = currentQty + quantity;

    if (totalQty > product.stock) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${product.stock}, in cart: ${currentQty}, requested: ${quantity}`,
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // FIX 1 — only productId and quantity go into the cart document.
      // No price, name, or image stored — those come from product service on read.
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const response = await buildCartResponse(cart);
    res.status(200).json({ message: 'Item added to cart', cart: response });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// UPDATE ITEM QUANTITY
// ─────────────────────────────────────────────────────────
exports.updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity }  = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity <= 0) {
      // Treat qty ≤ 0 as a remove — consistent with spec
      cart.items = cart.items.filter(
        item => !item.productId.equals(productId) // FIX 4 — .equals()
      );
    } else {
      const item = cart.findItem(productId);      // FIX 4 — .equals() via helper
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      // Validate new quantity against live stock
      const product = await fetchProduct(productId);
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units available`,
        });
      }

      item.quantity = quantity;
    }

    await cart.save();
    const response = await buildCartResponse(cart);
    res.status(200).json({ message: 'Cart updated', cart: response });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// REMOVE ITEM
// ─────────────────────────────────────────────────────────
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => !item.productId.equals(productId) // FIX 4 — .equals()
    );

    await cart.save();
    const response = await buildCartResponse(cart);
    res.status(200).json({ message: 'Item removed', cart: response });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// CLEAR CART
// ─────────────────────────────────────────────────────────
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart: { ...cart.toObject(), items: [], totalAmount: 0 } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};