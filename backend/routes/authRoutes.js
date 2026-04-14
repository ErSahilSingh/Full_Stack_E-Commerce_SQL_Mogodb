const express = require("express");
const AuthController = require("../controllers/AuthController");
const {
  validateRegisterBody,
  validateLoginBody,
} = require("../middleware/validateMiddleware");

const router = express.Router();

router.post("/register", validateRegisterBody, AuthController.register);
router.post("/login", validateLoginBody, AuthController.login);

module.exports = router;
