const Cart = require('../models/Cart');
const axios = require('axios');

// GET CART
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD ITEM TO CART
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Get product details from product service
    const { data: product } = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      item => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || ''
      });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE ITEM QUANTITY
exports.updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items = cart.items.filter(
        item => item.productId !== productId
      );
    } else {
      const item = cart.items.find(
        item => item.productId === productId
      );
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REMOVE ITEM
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message:'Cart cleared', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};