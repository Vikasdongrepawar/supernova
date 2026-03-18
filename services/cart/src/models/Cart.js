const mongoose = require('mongoose');

// FIX 1 — Lean cart item: store only what the cart OWNS.
// name, price, image are product data — they belong to the product service.
// Storing them here creates stale data the moment the seller edits the product.
// We store productId (to look up live data) and quantity (which the user controls).
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId, // FIX 2 — ObjectId, not String
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId here too — consistent with User._id
      required: true,
      unique: true,
    },
    items: [cartItemSchema],

    // FIX: totalAmount is NOT stored.
    // It is computed fresh on every GET from live product prices.
    // A stored total is a lie the moment any product price changes.
  },
  { timestamps: true }
);

// Helper: find a cart item by productId safely using .equals()
// FIX 4 — ObjectId comparison must use .equals(), not ===
// ObjectId === ObjectId is always false even for the same value (reference equality)
cartSchema.methods.findItem = function (productId) {
  return this.items.find(item => item.productId.equals(productId));
};

module.exports = mongoose.model('Cart', cartSchema);