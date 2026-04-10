const { z } = require("zod");
const pool = require("../config/db");

const listingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  platform: z.enum(["instagram", "youtube", "twitter", "twitch", "telegram", "tiktok", "other"]),
  handle: z.string().min(2),
  followers_count: z.number().int().nonnegative(),
  engagement_rate: z.number().nonnegative(),
  price_usd: z.number().nonnegative(),
  category: z.string().min(2),
  country: z.string().min(2),
  status: z.enum(["active", "sold", "draft"]).optional(),
});

exports.getListings = async (req, res) => {
  try {
    const {
      platform,
      category,
      country,
      minPrice,
      maxPrice,
      minFollowers,
      sort = "latest",
      page = 1,
      limit = 12,
    } = req.query;

    const where = ["status = 'active'"];
    const values = [];

    if (platform) {
      values.push(platform);
      where.push(`platform = $${values.length}`);
    }
    if (category) {
      values.push(category);
      where.push(`category = $${values.length}`);
    }
    if (country) {
      values.push(country);
      where.push(`country = $${values.length}`);
    }
    if (minPrice) {
      values.push(Number(minPrice));
      where.push(`price_usd >= $${values.length}`);
    }
    if (maxPrice) {
      values.push(Number(maxPrice));
      where.push(`price_usd <= $${values.length}`);
    }
    if (minFollowers) {
      values.push(Number(minFollowers));
      where.push(`followers_count >= $${values.length}`);
    }

    const sortMap = {
      latest: "created_at DESC",
      price_asc: "price_usd ASC",
      price_desc: "price_usd DESC",
      followers_desc: "followers_count DESC",
    };

    const offset = (Number(page) - 1) * Number(limit);
    values.push(Number(limit), offset);

    const query = `
      SELECT l.*, u.username, u.avatar_url
      FROM listings l
      JOIN users u ON u.id = l.seller_id
      WHERE ${where.join(" AND ")}
      ORDER BY ${sortMap[sort] || sortMap.latest}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM listings
      WHERE ${where.join(" AND ")}
    `;
    const countValues = values.slice(0, values.length - 2);

    const [listingsResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, countValues),
    ]);

    return res.status(200).json({
      data: listingsResult.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: countResult.rows[0].total,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch listings", error: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.username, u.avatar_url, u.created_at AS seller_joined
       FROM listings l
       JOIN users u ON u.id = l.seller_id
       WHERE l.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Listing not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch listing", error: error.message });
  }
};

exports.createListing = async (req, res) => {
  try {
    const parsed = listingSchema.safeParse({
      ...req.body,
      followers_count: Number(req.body.followers_count),
      engagement_rate: Number(req.body.engagement_rate),
      price_usd: Number(req.body.price_usd),
    });
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const data = parsed.data;
    const result = await pool.query(
      `INSERT INTO listings
      (seller_id, title, description, platform, handle, followers_count, engagement_rate, price_usd, category, country, status, image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        req.user.id,
        data.title,
        data.description,
        data.platform,
        data.handle,
        data.followers_count,
        data.engagement_rate,
        data.price_usd,
        data.category,
        data.country,
        data.status || "active",
        imageUrl,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create listing", error: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const own = await pool.query("SELECT seller_id FROM listings WHERE id = $1", [req.params.id]);
    if (!own.rows.length) return res.status(404).json({ message: "Listing not found" });
    if (own.rows[0].seller_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payload = {
      ...req.body,
      followers_count: Number(req.body.followers_count),
      engagement_rate: Number(req.body.engagement_rate),
      price_usd: Number(req.body.price_usd),
    };
    const parsed = listingSchema.partial().safeParse(payload);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const fields = Object.keys(parsed.data);
    if (!fields.length) return res.status(400).json({ message: "No fields to update" });

    const values = fields.map((k) => parsed.data[k]);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE listings SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update listing", error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const own = await pool.query("SELECT seller_id FROM listings WHERE id = $1", [req.params.id]);
    if (!own.rows.length) return res.status(404).json({ message: "Listing not found" });
    if (own.rows[0].seller_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    await pool.query("DELETE FROM listings WHERE id = $1", [req.params.id]);
    return res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete listing", error: error.message });
  }
};

exports.getListingsByUser = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings WHERE seller_id = $1 ORDER BY created_at DESC", [
      req.params.userId,
    ]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user listings", error: error.message });
  }
};
