const express = require("express");
const { verifyAccessToken } = require("../middleware/auth");
const { saveListing, unsaveListing, getSavedListings } = require("../controllers/savedController");

const router = express.Router();
router.post("/:listingId", verifyAccessToken, saveListing);
router.delete("/:listingId", verifyAccessToken, unsaveListing);
router.get("/", verifyAccessToken, getSavedListings);

module.exports = router;
