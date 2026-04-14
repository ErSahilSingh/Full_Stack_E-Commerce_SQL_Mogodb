const express = require("express");
const ProductController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  sanitizeProductListQuery,
  validateProductCreateBody,
} = require("../middleware/validateMiddleware");

const router = express.Router();

router.get(
  "/",
  sanitizeProductListQuery,
  ProductController.getAll
);
router.get("/:id", ProductController.getById);
router.post(
  "/",
  authMiddleware,
  validateProductCreateBody,
  ProductController.create
);

module.exports = router;
