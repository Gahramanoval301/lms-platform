const jwt = require("jsonwebtoken");
const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};
const authenticate = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "No access token provided",
    });
  }

  let payload = verifyToken(accessToken, process.env.JWT_SECRET_KEY);

  console.log(payload, "payloadd");

  if (!payload) {
    // Access token expired → try refresh
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please log in again",
      });
    }

    try {
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      console.log(refreshPayload, "refreshhhPayload");

      //  new access token
      const newAccessToken = jwt.sign(
        { userId: refreshPayload.userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      console.log(newAccessToken, "New access tokenn");

      // set new cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      req.user = refreshPayload;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token, please log in again",
      });
    }
  }

  // Access token still valid
  req.user = payload;
  next();
};
module.exports = authenticate;
