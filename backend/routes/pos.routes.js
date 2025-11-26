const express = require("express");
const {
  getItemByBarcode,
  getItemByItemName,
} = require("../controllers/pos.controller");
const verifyJwtMiddleware = require("../middleware/verifyJWTMiddleware");

const router = express.Router();

router.get(
  "/search_by_barcode/:barcode",
  verifyJwtMiddleware,
  getItemByBarcode
);
router.get(
  "/search_by_name/:searchTerm",
  verifyJwtMiddleware,
  getItemByItemName
);

module.exports = router;
