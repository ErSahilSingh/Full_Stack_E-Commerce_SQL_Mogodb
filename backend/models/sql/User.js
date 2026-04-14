const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../../config/db");

const createAccessToken = (userRow) => {
  return jwt.sign(
    { userId: userRow.id, email: userRow.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const registerWithPassword = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await create({
    name,
    email,
    passwordHash,
  });
  const token = createAccessToken({ id: userId, email });
  return {
    token,
    user: { id: userId, name, email },
  };
};

const loginWithCredentials = async ({ email, password }) => {
  const user = await findByEmail(email);
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }
  const token = createAccessToken({ id: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

const create = async ({ name, email, passwordHash }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );
  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

module.exports = {
  create,
  findByEmail,
  findById,
  registerWithPassword,
  loginWithCredentials,
  createAccessToken,
};
