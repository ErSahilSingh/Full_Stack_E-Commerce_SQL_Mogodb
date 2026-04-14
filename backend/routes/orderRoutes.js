const express = require("express");
const OrderController = require("../controllers/OrderController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/checkout", OrderController.checkout);
router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrderById);

module.exports = router;
