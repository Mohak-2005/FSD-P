const pool = require("../config/db");

exports.saveListing = async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_id) DO NOTHING
       RETURNING *`,
      [req.user.id, req.params.listingId]
    );
    return res.status(201).json(result.rows[0] || { message: "Already saved" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save listing", error: error.message });
  }
};

exports.unsaveListing = async (req, res) => {
  try {
    await pool.query("DELETE FROM saved_listings WHERE user_id = $1 AND listing_id = $2", [
      req.user.id,
      req.params.listingId,
    ]);
    return res.status(200).json({ message: "Removed from saved listings" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove listing", error: error.message });
  }
};

exports.getSavedListings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.* FROM saved_listings s
       JOIN listings l ON l.id = s.listing_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch saved listings", error: error.message });
  }
};
