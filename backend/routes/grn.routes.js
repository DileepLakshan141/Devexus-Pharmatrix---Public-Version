const express = require("express");
const router = express.Router();
const {
  createGRN,
  getAllGRNs,
  getGRNById,
  deleteGRN,
} = require("../controllers/grn.controller");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const verifyUser = require("../middleware/verifyUserMiddleware");

router.post("/", verifyUser, verifyAdminRole, createGRN);
router.get("/", getAllGRNs);

module.exports = router;
