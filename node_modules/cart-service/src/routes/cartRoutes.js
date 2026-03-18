const express = require('express');
const router = express.Router();
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected
router.get('/', protect, getCart);
router.post('/items', protect, addItem);
router.patch('/items/:productId', protect, updateItem);
router.delete('/items/:productId', protect, removeItem);
router.delete('/', protect, clearCart);

module.exports = router;