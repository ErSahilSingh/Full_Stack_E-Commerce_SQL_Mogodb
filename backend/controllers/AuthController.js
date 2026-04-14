const User = require("../models/sql/User");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await User.registerWithPassword({ name, email, password });
    return res.status(201).json({
      data: { token: result.token, user: result.user },
      message: "Registered successfully",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already registered" });
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await User.loginWithCredentials({ email, password });
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.json({
      data: { token: result.token, user: result.user },
      message: "Logged in successfully",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
