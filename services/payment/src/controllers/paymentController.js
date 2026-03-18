const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const axios = require('axios');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const { data } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/orders/${orderId}`,
      { headers: { Authorization: req.headers.authorization } }
    );

    const order = data.order;
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${orderId}`
    });

    const payment = await Payment.create({
      orderId,
      userId: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount
    });

    res.status(201).json({
      message: 'Payment order created',
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      payment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: 'completed' },
      { new: true }
    );

    res.status(200).json({
      message: 'Payment verified successfully',
      payment
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ payment });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};