const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegisterBody = (req, res, next) => {
  const { name, email, password } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || typeof email !== "string" || !emailPattern.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
  return next();
};

const validateLoginBody = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== "string" || !emailPattern.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }
  req.body = {
    email: email.trim().toLowerCase(),
    password,
  };
  return next();
};

const sanitizeProductListQuery = (req, res, next) => {
  const raw = req.query.search;
  if (raw === undefined || raw === null) {
    req.sanitizedSearch = "";
    return next();
  }
  const str = String(raw);
  req.sanitizedSearch = str.replace(/[${};]/g, "");
  return next();
};

const validateProductCreateBody = (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Product name is required" });
  }
  if (!category || typeof category !== "string" || !category.trim()) {
    return res.status(400).json({ error: "Category is required" });
  }
  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }
  const stockNum = stock === undefined ? 0 : Number(stock);
  if (Number.isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ error: "Invalid stock" });
  }
  req.body = {
    name: name.trim(),
    description: description === undefined ? "" : String(description),
    price: priceNum,
    category: category.trim(),
    stock: stockNum,
    images: Array.isArray(images) ? images.map((x) => String(x)) : [],
  };
  return next();
};

const validateCartAddBody = (req, res, next) => {
  const { productId, quantity } = req.body || {};
  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }
  const qty = Number(quantity);
  if (Number.isNaN(qty) || qty < 1) {
    return res.status(400).json({ error: "Invalid quantity" });
  }
  req.body = { productId: String(productId), quantity: qty };
  return next();
};

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  sanitizeProductListQuery,
  validateProductCreateBody,
  validateCartAddBody,
};
