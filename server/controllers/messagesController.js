const pool = require("../config/db");

exports.getThread = async (req, res) => {
  try {
    const listingId = Number(req.params.listingId);
    const userId = Number(req.params.userId);
    const currentUserId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE listing_id = $1
       AND ((sender_id = $2 AND receiver_id = $3) OR (sender_id = $3 AND receiver_id = $2))
       ORDER BY created_at ASC`,
      [listingId, currentUserId, userId]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch thread", error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, listingId, content } = req.body;
    if (!receiverId || !listingId || !content) {
      return res.status(400).json({ message: "receiverId, listingId and content are required" });
    }
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, listing_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, receiverId, listingId, content]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (
          LEAST(m.sender_id, m.receiver_id),
          GREATEST(m.sender_id, m.receiver_id),
          m.listing_id
        )
        m.*,
        l.title AS listing_title,
        CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
        u.username AS other_username
      FROM messages m
      JOIN listings l ON l.id = m.listing_id
      JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY LEAST(m.sender_id, m.receiver_id), GREATEST(m.sender_id, m.receiver_id), m.listing_id, m.created_at DESC`,
      [req.user.id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { listingId, senderId } = req.body;
    await pool.query(
      `UPDATE messages SET is_read = true
       WHERE listing_id = $1 AND sender_id = $2 AND receiver_id = $3`,
      [listingId, senderId, req.user.id]
    );
    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark as read", error: error.message });
  }
};
