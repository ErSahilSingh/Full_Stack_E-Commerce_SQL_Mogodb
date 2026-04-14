const express = require("express");
const CartController = require("../controllers/CartController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateCartAddBody } = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", CartController.getCart);
router.post("/add", validateCartAddBody, CartController.addItem);
router.delete("/remove/:productId", CartController.removeItem);
router.delete("/clear", CartController.clearCart);

module.exports = router;
