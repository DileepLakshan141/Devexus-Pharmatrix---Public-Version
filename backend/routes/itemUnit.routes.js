const express = require("express");
const router = express.Router();
const {
  createItemUnit,
  getUnitsByItem,
} = require("../controllers/itemUnit.controller");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const verifyUser = require("../middleware/verifyUserMiddleware");

router.post("/", verifyUser, verifyAdminRole, createItemUnit);
// router.get("/", getAllItemUnits);
router.get("/:id", getUnitsByItem);
// router.put("/:id", updateItemUnit);
// router.delete("/:id", deleteItemUnit);

module.exports = router;
