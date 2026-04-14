const Product = require("../models/mongo/Product");

const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = req.sanitizedSearch || "";
    const result = await Product.findPaginated({ page, limit, search });
    return res.json({ data: result, message: "Products loaded" });
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdString(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ data: product, message: "Product loaded" });
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const created = await Product.createOne({
      name,
      description,
      price,
      category,
      stock,
      images,
    });
    return res.status(201).json({ data: created, message: "Product created" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getAll, getById, create };
