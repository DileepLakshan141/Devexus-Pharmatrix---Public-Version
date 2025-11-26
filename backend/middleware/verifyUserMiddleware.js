const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "No access token cookie found" });
  }

  const user = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
  if (!user || !user.id) {
    return res
      .status(401)
      .json({ message: "Invalid token or user data missing" });
  }

  req.user = user;
  next();
};

module.exports = verifyUser;
