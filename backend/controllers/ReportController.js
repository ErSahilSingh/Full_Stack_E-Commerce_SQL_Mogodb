const Order = require("../models/sql/Order");
const SaleLine = require("../models/mongo/SaleLine");

const dailyRevenue = async (req, res, next) => {
  try {
    const rows = await Order.getDailyRevenueLast7Days();
    return res.json({ data: rows, message: "Daily revenue loaded" });
  } catch (err) {
    return next(err);
  }
};

const topSpenders = async (req, res, next) => {
  try {
    const rows = await Order.getTopSpenders();
    return res.json({ data: rows, message: "Top spenders loaded" });
  } catch (err) {
    return next(err);
  }
};

const categorySales = async (req, res, next) => {
  try {
    const rows = await SaleLine.aggregateCategorySales();
    return res.json({ data: rows, message: "Category sales loaded" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { dailyRevenue, topSpenders, categorySales };
