const express = require("express");
const { verifyAccessToken } = require("../middleware/auth");
const { createReview, getReviewsByUser } = require("../controllers/reviewsController");

const router = express.Router();
router.post("/", verifyAccessToken, createReview);
router.get("/user/:userId", getReviewsByUser);

module.exports = router;
