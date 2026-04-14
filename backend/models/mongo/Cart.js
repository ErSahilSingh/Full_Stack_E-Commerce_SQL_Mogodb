const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);

const findByUserId = async (userId) => {
  return Cart.findOne({ userId }).lean();
};

const upsertAddItem = async (userId, item) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    const created = await Cart.create({
      userId,
      items: [item],
      updatedAt: new Date(),
    });
    return created.toObject();
  }
  const idx = cart.items.findIndex(
    (i) => String(i.productId) === String(item.productId)
  );
  if (idx >= 0) {
    cart.items[idx].quantity += item.quantity;
  } else {
    cart.items.push(item);
  }
  cart.updatedAt = new Date();
  await cart.save();
  return cart.toObject();
};

const removeItemByProductId = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return null;
  }
  cart.items = cart.items.filter(
    (i) => String(i.productId) !== String(productId)
  );
  cart.updatedAt = new Date();
  await cart.save();
  return cart.toObject();
};

const deleteByUserId = async (userId) => {
  await Cart.deleteOne({ userId });
};

module.exports = { Cart, findByUserId, upsertAddItem, removeItemByProductId, deleteByUserId };
