const express = require("express");
const { register, login, updateUserInfo, updateUserPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-info", authMiddleware, updateUserInfo);
router.put("/update-password", authMiddleware, updateUserPassword);

module.exports = router;
