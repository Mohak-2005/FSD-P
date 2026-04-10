const pool = require("../config/db");

exports.getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, avatar_url, bio, created_at, is_verified, role FROM users WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, bio, avatar_url } = req.body;
    const result = await pool.query(
      `UPDATE users
       SET username = COALESCE($1, username),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, username, email, avatar_url, bio, created_at, is_verified, role`,
      [username || null, bio || null, avatar_url || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.username AS reviewer_username
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.reviewed_user_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};
