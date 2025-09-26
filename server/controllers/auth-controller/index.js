const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      password: checkUser.password,
      role: checkUser.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { _id: checkUser._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in DB
  checkUser.refreshToken = refreshToken;
  await checkUser.save();

  //set httponly cookies

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      password: checkUser.password,
      role: checkUser.role,
    },
  });
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== token) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // new access token
    const accessToken = jwt.sign(
      { _id: user._id, userName: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
};
module.exports = { registerUser, loginUser, refreshToken, logout };
