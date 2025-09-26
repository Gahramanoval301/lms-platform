const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  refreshToken: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
