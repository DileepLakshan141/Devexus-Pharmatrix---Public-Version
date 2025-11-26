const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      username: user.username,
      id: user._id,
      role: user.user_role,
    },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "40m" }
  );

  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
