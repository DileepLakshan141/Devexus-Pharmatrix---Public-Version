const express = require("express");
const router = express.Router();
const { getDashboardInsights } = require("../controllers/dashboard.controller");

router.get("/insights", getDashboardInsights);

module.exports = router;
