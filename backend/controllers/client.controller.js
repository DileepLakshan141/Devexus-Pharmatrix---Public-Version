const asyncHandler = require("express-async-handler");
const ClientModel = require("../models/client.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/tokenGenerator");

// client account creation
const clientAccountCreate = asyncHandler(async (req, res) => {
  const { username, email, telephone, password, role } = req.body;

  if (!username || !email || !telephone || !password || !role) {
    return res.status(400).json({
      message:
        "username, email, telephon, user role and password is required for client account creation",
    });
  }

  const existingClient = await ClientModel.findOne({ email });
  if (existingClient) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const createdClient = await ClientModel.create({
    username,
    email,
    telephone,
    password: hashedPassword,
    profile: "dummy pic",
    user_role: role,
  });

  if (createdClient) {
    return res.status(201).json({
      user_id: createdClient._id,
      email: createdClient.email,
      username: createdClient.username,
    });
  } else {
    return res.status(400).json({
      message: "Error occured while creating client account!",
    });
  }
});

// client login
const clientLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required!" });
  }

  const foundUser = await ClientModel.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ error: "client does not exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "invalid username or password" });
  }

  if (foundUser.status != "activated")
    return res.status(403).json({ message: "your account has been suspended" });

  let access_token, refresh_token;
  try {
    access_token = generateAccessToken({
      username: foundUser.username,
      _id: foundUser._id,
      user_role: foundUser.user_role,
    });
    refresh_token = generateRefreshToken(foundUser);
    res.cookie("jwt", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 25 * 60 * 1000,
    });
  } catch (tokenError) {
    console.error("Token generation failed:", tokenError);
    return res.status(500).json({ error: "Token generation failed" });
  }

  try {
    foundUser.refresh_token = refresh_token;
    await foundUser.save();

    res.cookie("refreshJwt", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
  } catch (cookieOrSaveError) {
    console.error(
      "Failed to save refresh token or set cookie:",
      cookieOrSaveError
    );
    return res.status(500).json({ error: "Login session setup failed" });
  }

  return res.status(202).json({
    access_token,
    username: foundUser.username,
    user_id: foundUser._id,
    email: foundUser.email,
    telephone: foundUser.telephone,
    user_role: foundUser.user_role,
    profile: foundUser.profile,
  });
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshJwt) {
    return res.sendStatus(401);
  }

  const refresh_token = cookie.refreshJwt;
  const foundUser = await ClientModel.findOne({ refresh_token }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({
      username: decoded.username,
      _id: decoded._id,
      user_role: decoded.user_role,
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken });
  });
});

// client logout
const logoutUser = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt && !cookies?.refreshJwt) {
    return res.status(401).json({ message: "No cookies found!" });
  }

  const access_token = cookies.jwt;
  const refresh_token = cookies.refreshJwt;

  let foundUser = await ClientModel.findOne({ refresh_token }).exec();

  const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("jwt", clearCookieOptions);
  res.clearCookie("refreshJwt", clearCookieOptions);

  if (foundUser) {
    foundUser.refresh_token = "";
    await foundUser.save();
  }

  return res.status(200).json({ message: "Logout successful" });
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await ClientModel.find({}).exec();
    if (users) {
      return res.status(200).json({
        message: "User accounts retrieved successfully!",
        data: users,
      });
    } else {
      return res.status(400).json({ message: "no users found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccountActivationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "user id is required" });

    const targetUser = await ClientModel.findById(userId);
    if (!targetUser) return res.status(404).json({ message: "user not found" });

    targetUser.status === "activated"
      ? (targetUser.status = "deactivated")
      : (targetUser.status = "activated");
    await targetUser.save();

    return res.status(200).json({ message: "account status updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  clientAccountCreate,
  clientLogin,
  refreshTokenHandler,
  logoutUser,
  getAllUsers,
  updateAccountActivationStatus,
};
