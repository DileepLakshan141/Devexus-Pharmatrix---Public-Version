const express = require("express");
const router = express.Router();
const {
  getBatchesByItem,
  getLowStockAlerts,
  getInventory,
  getExpiryAlerts,
  writeOffExpiredStock,
} = require("../controllers/inventory.controller");
const verifyUser = require("../middleware/verifyUserMiddleware");

router.get("/", getInventory);
router.get("/batch-find/:itemId", getBatchesByItem);
router.get("/low-stock/", getLowStockAlerts);
router.get("/expire-alerts/", getExpiryAlerts);
router.get("/writeoff/", verifyUser, writeOffExpiredStock);

module.exports = router;
