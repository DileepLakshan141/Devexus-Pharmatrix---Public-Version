const express = require("express");
const router = express.Router();
const {
  getSalesReport,
  getWriteOffReport,
} = require("../controllers/report.controller");
const verifyJwtMiddleware = require("../middleware/verifyJWTMiddleware");

router.post("/sales-report", verifyJwtMiddleware, getSalesReport);
router.post("/writeoff-report", verifyJwtMiddleware, getWriteOffReport);

module.exports = router;
