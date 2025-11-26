const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "No access token cookie found" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token expired or invalid" });
    req.userInfo = decoded;
    next();
  });
};

module.exports = verifyJWT;
