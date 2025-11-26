const ROLES = require("../config/auth_roles");
const verifyAdminRole = (req, res, next) => {
  if (req.user) {
    const user = req.user;
    if (user.role != ROLES.ADMIN)
      return res.status(403).json({ message: "Admin privileges required!" });
  } else {
    return res.status(400).json({ message: "No user found" });
  }
  next();
};

module.exports = verifyAdminRole;
