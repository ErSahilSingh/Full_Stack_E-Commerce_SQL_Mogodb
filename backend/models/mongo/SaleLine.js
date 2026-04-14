const mongoose = require("mongoose");

const saleLineSchema = new mongoose.Schema({
  orderId: { type: Number, required: true },
  userId: { type: Number, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  revenue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SaleLine = mongoose.model("SaleLine", saleLineSchema);

const insertManyForOrder = async (docs) => {
  if (!docs.length) {
    return;
  }
  await SaleLine.insertMany(docs);
};

const aggregateCategorySales = async () => {
  return SaleLine.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$category",
        totalQuantity: { $sum: "$quantity" },
        totalRevenue: { $sum: "$revenue" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);
};

module.exports = { SaleLine, insertManyForOrder, aggregateCategorySales };
