const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }, // User verification status
    isActive: { type: Boolean, default: true }, // User active status
    phoneNumber: { type: String, unique: true, sparse: true }, // Optional phone number
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
