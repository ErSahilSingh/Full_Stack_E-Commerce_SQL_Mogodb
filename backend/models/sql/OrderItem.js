const insertManyForOrder = async (connection, orderId, items) => {
  for (const item of items) {
    await connection.execute(
      "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)",
      [
        orderId,
        String(item.productId),
        item.productName,
        item.quantity,
        item.price,
      ]
    );
  }
};

module.exports = { insertManyForOrder };
