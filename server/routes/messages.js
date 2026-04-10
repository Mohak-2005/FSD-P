const express = require("express");
const { verifyAccessToken } = require("../middleware/auth");
const { getThread, sendMessage, getConversations, markRead } = require("../controllers/messagesController");

const router = express.Router();
router.get("/conversations", verifyAccessToken, getConversations);
router.get("/:listingId/:userId", verifyAccessToken, getThread);
router.post("/", verifyAccessToken, sendMessage);
router.post("/mark-read", verifyAccessToken, markRead);

module.exports = router;
