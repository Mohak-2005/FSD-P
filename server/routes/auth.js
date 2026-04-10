const express = require("express");
const { register, login, logout, me, refresh } = require("../controllers/authController");
const { verifyAccessToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", verifyAccessToken, me);

module.exports = router;
