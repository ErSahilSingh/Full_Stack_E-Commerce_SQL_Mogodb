const Cart = require("../models/mongo/Cart");
const Product = require("../models/mongo/Product");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findByUserId(userId);
    return res.json({
      data: cart || { userId, items: [], updatedAt: null },
      message: "Cart loaded",
    });
  } catch (err) {
    return next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    if (!Product.isValidObjectIdString(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await Product.findByIdString(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    };
    const cart = await Cart.upsertAddItem(userId, item);
    return res.json({ data: cart, message: "Item added to cart" });
  } catch (err) {
    return next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    if (!Product.isValidObjectIdString(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const cart = await Cart.removeItemByProductId(userId, productId);
    return res.json({ data: cart, message: "Item removed" });
  } catch (err) {
    return next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await Cart.deleteByUserId(userId);
    return res.json({ data: null, message: "Cart cleared" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getCart, addItem, removeItem, clearCart };
