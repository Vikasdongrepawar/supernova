const Order = require('../models/Order');
const axios = require('axios');

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get cart from cart service
    const { data: cart } = await axios.get(
      `${process.env.CART_SERVICE_URL}/cart`,
      { headers: { Authorization: req.headers.authorization } }
    );

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order from cart items
    const order = await Order.create({
      userId: req.user.id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress
    });

    // Clear cart after order is placed
    await axios.delete(
      `${process.env.CART_SERVICE_URL}/cart`,
      { headers: { Authorization: req.headers.authorization } }
    );

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE ORDER
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only cancel pending orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled', order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};