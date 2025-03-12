const User = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const register = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      phoneNumber,
      verified: false,
      isActive: true,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ message: "Account is deactivated" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1y" });
    res.json({ token, expiresIn: "1 year" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Info
const updateUserInfo = async (req, res) => {
  try {
    const { email, phoneNumber, isActive } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.json({ message: "User information updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Password
const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, updateUserInfo, updateUserPassword };
