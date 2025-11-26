const express = require("express");
const router = express.Router();
const {
  clientAccountCreate,
  clientLogin,
  refreshTokenHandler,
  logoutUser,
  getAllUsers,
  updateAccountActivationStatus,
} = require("../controllers/client.controller");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const verifyUser = require("../middleware/verifyUserMiddleware");
const verifyJWTMiddleware = require("../middleware/verifyJWTMiddleware");

router.get("/", verifyUser, getAllUsers);
router.put(
  "/status/:userId",
  verifyUser,
  verifyAdminRole,
  updateAccountActivationStatus
);
router.post("/auth", clientLogin);
router.get("/signout", logoutUser);
router.get("/refresh", verifyJWTMiddleware, refreshTokenHandler);
router.post("/signup", verifyUser, verifyAdminRole, clientAccountCreate);

module.exports = router;
