const pool = require("../config/db");

exports.createReview = async (req, res) => {
  try {
    const { reviewed_user_id, listing_id, rating, comment } = req.body;
    if (!reviewed_user_id || !listing_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await pool.query(
      `INSERT INTO reviews (reviewer_id, reviewed_user_id, listing_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, reviewed_user_id, listing_id, rating, comment || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create review", error: error.message });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.username AS reviewer_username
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE reviewed_user_id = $1
       ORDER BY created_at DESC`,
      [req.params.userId]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};
