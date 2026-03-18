const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are protected
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);

module.exports = router;