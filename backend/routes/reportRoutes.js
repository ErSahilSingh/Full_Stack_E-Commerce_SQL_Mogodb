const express = require("express");
const ReportController = require("../controllers/ReportController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/daily-revenue", ReportController.dailyRevenue);
router.get("/top-spenders", ReportController.topSpenders);
router.get("/category-sales", ReportController.categorySales);

module.exports = router;
