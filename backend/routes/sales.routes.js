const express = require("express");
const router = express.Router();
const {
  createSale,
  getAllSales,
  getSaleById,
} = require("../controllers/sales.controller");
const verifyJwtMiddleware = require("../middleware/verifyJWTMiddleware");

router.post("/create", verifyJwtMiddleware, createSale);
router.get("/", verifyJwtMiddleware, getAllSales);
router.get("/:id", verifyJwtMiddleware, getSaleById);

module.exports = router;
