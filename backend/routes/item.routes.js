const express = require("express");
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleItemPOS,
  getItemsBySupplier,
} = require("../controllers/item.controller");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const verifyUser = require("../middleware/verifyUserMiddleware");

router.post("/", verifyUser, verifyAdminRole, createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/sup-search/:id", getItemsBySupplier);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/toggle/:id", toggleItemPOS);

module.exports = router;
