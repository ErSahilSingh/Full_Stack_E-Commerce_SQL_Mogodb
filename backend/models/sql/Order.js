const { pool } = require("../../config/db");
const OrderItem = require("./OrderItem");
const Cart = require("../mongo/Cart");
const Product = require("../mongo/Product");
const SaleLine = require("../mongo/SaleLine");

const mapJoinedRowsToOrders = (rows) => {
  const orderMap = new Map();
  for (const row of rows) {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        id: row.order_id,
        user_id: row.user_id,
        total_amount: row.total_amount,
        status: row.status,
        created_at: row.order_created_at,
        items: [],
      });
    }
    if (row.item_id) {
      orderMap.get(row.order_id).items.push({
        id: row.item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.item_quantity,
        price: row.item_price,
      });
    }
  }
  return Array.from(orderMap.values());
};

const checkoutWithTransaction = async (userId, cartItems, totalAmount) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'pending')",
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;
    const normalized = cartItems.map((c) => ({
      productId: c.productId,
      productName: c.name,
      quantity: c.quantity,
      price: c.price,
    }));
    await OrderItem.insertManyForOrder(connection, orderId, normalized);
    await connection.commit();
    return orderId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const checkoutFromCart = async (userId) => {
  const cart = await Cart.findByUserId(userId);
  if (!cart || !cart.items || cart.items.length === 0) {
    const err = new Error("Cart is empty");
    err.statusCode = 400;
    throw err;
  }
  let totalAmount = 0;
  for (const item of cart.items) {
    totalAmount += item.price * item.quantity;
  }
  const normalizedCartItems = cart.items.map((i) => ({
    productId: i.productId,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
  }));
  const orderId = await checkoutWithTransaction(
    userId,
    normalizedCartItems,
    totalAmount
  );
  const saleDocs = [];
  for (const item of cart.items) {
    const prod = await Product.findByIdString(String(item.productId));
    const category = prod && prod.category ? prod.category : "unknown";
    saleDocs.push({
      orderId,
      userId,
      productId: item.productId,
      category,
      quantity: item.quantity,
      unitPrice: item.price,
      revenue: item.price * item.quantity,
    });
  }
  await SaleLine.insertManyForOrder(saleDocs);
  await Cart.deleteByUserId(userId);
  return orderId;
};

const findAllByUserIdWithItems = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT o.id AS order_id, o.user_id, o.total_amount, o.status, o.created_at AS order_created_at,
            oi.id AS item_id, oi.product_id, oi.product_name, oi.quantity AS item_quantity, oi.price AS item_price
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC, oi.id ASC`,
    [userId]
  );
  return mapJoinedRowsToOrders(rows);
};

const findByIdAndUserIdWithItems = async (orderId, userId) => {
  const [rows] = await pool.execute(
    `SELECT o.id AS order_id, o.user_id, o.total_amount, o.status, o.created_at AS order_created_at,
            oi.id AS item_id, oi.product_id, oi.product_name, oi.quantity AS item_quantity, oi.price AS item_price
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.id = ? AND o.user_id = ?
     ORDER BY oi.id ASC`,
    [orderId, userId]
  );
  if (rows.length === 0) {
    return null;
  }
  return mapJoinedRowsToOrders(rows)[0];
};

const getDailyRevenueLast7Days = async () => {
  const [rows] = await pool.execute(
    `SELECT DATE(created_at) AS day, COALESCE(SUM(total_amount), 0) AS revenue
     FROM orders
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY DATE(created_at)
     ORDER BY day ASC`
  );
  return rows;
};

const getTopSpenders = async () => {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, COALESCE(SUM(o.total_amount), 0) AS total_spent
     FROM users u
     INNER JOIN orders o ON u.id = o.user_id
     GROUP BY u.id, u.name, u.email
     ORDER BY total_spent DESC
     LIMIT 3`
  );
  return rows;
};

module.exports = {
  checkoutWithTransaction,
  checkoutFromCart,
  findAllByUserIdWithItems,
  findByIdAndUserIdWithItems,
  getDailyRevenueLast7Days,
  getTopSpenders,
};
