const Order = require("../models/sql/Order");

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orderId = await Order.checkoutFromCart(userId);
    return res.status(201).json({
      data: { orderId },
      message: "Order placed successfully",
    });
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.findAllByUserIdWithItems(userId);
    return res.json({ data: orders, message: "Orders loaded" });
  } catch (err) {
    return next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const orderId = parseInt(id, 10);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order id" });
    }
    const order = await Order.findByIdAndUserIdWithItems(orderId, userId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json({ data: order, message: "Order loaded" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { checkout, getOrders, getOrderById };
