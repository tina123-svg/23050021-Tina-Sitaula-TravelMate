const express = require("express");
const { register, login, resetPassword, forgotPassword, verifyOtp } = require("../controller/authController");
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resetpassword", resetPassword);
module.exports = router;
