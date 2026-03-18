const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:id', protect, getPayment);

module.exports = router;