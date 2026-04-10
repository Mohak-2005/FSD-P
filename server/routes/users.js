const express = require("express");
const { verifyAccessToken, requireSelfOrAdmin } = require("../middleware/auth");
const { getUserById, updateUser, getUserReviews } = require("../controllers/usersController");

const router = express.Router();
router.get("/:id", getUserById);
router.put("/:id", verifyAccessToken, requireSelfOrAdmin, updateUser);
router.get("/:id/reviews", getUserReviews);

module.exports = router;
