const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplier.controller");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const verifyUser = require("../middleware/verifyUserMiddleware");
const verifyJwtMiddleware = require("../middleware/verifyJWTMiddleware");

router.post("/", verifyUser, verifyAdminRole, createSupplier);
router.get("/", verifyJwtMiddleware, getAllSuppliers);
router.get("/:id", verifyJwtMiddleware, getSupplierById);
router.put("/:id", verifyJwtMiddleware, updateSupplier);
router.delete("/:id", verifyJwtMiddleware, deleteSupplier);

module.exports = router;
