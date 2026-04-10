const express = require("express");
const upload = require("../middleware/upload");
const { verifyAccessToken } = require("../middleware/auth");
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByUser,
} = require("../controllers/listingsController");

const router = express.Router();

router.get("/", getListings);
router.get("/user/:userId", getListingsByUser);
router.get("/:id", getListingById);
router.post("/", verifyAccessToken, upload.single("image"), createListing);
router.put("/:id", verifyAccessToken, updateListing);
router.delete("/:id", verifyAccessToken, deleteListing);

module.exports = router;
