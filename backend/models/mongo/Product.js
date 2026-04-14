const mongoose = require("mongoose");
const { demoProducts } = require("../../data/demoProducts");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ name: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toLeanDemo = (p) => ({
  ...p,
  _id: new mongoose.Types.ObjectId(p._id),
});

const findPaginatedFromDemo = ({ page, limit, search }) => {
  let list = [...demoProducts];
  if (search && search.trim()) {
    const trimmed = search.trim();
    const safe = escapeRegex(trimmed);
    const re = new RegExp(safe, "i");
    list = list.filter((p) => re.test(p.name) || re.test(p.category));
  }
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = list.length;
  const skip = (page - 1) * limit;
  const items = list
    .slice(skip, skip + limit)
    .map((p) => toLeanDemo(p));
  return { items, total, page, limit };
};

const findPaginated = async ({ page, limit, search }) => {
  const dbTotal = await Product.countDocuments({});
  if (dbTotal === 0) {
    return findPaginatedFromDemo({ page, limit, search });
  }
  const skip = (page - 1) * limit;
  const filter = {};
  if (search && search.trim()) {
    const trimmed = search.trim();
    const safe = escapeRegex(trimmed);
    if (/^[\p{L}\p{N}\s]+$/u.test(trimmed)) {
      filter.$text = { $search: trimmed };
    } else {
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } },
      ];
    }
  }
  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

const isValidObjectIdString = (id) => mongoose.isValidObjectId(id);

const findByIdString = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  const doc = await Product.findById(id).lean();
  if (doc) {
    return doc;
  }
  const demo = demoProducts.find((p) => p._id === id);
  if (!demo) {
    return null;
  }
  return toLeanDemo(demo);
};

const createOne = async (payload) => {
  const doc = await Product.create(payload);
  return doc.toObject();
};

module.exports = {
  Product,
  findPaginated,
  findByIdString,
  createOne,
  isValidObjectIdString,
};
