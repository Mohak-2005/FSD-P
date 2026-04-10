const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const pool = require("../config/db");

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const demoUser = {
  id: 999,
  username: "alicegrowth",
  email: "alice@flippearn.dev",
  role: "user",
  created_at: new Date().toISOString(),
};

const signTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const isDbConnectionError = (error) => {
  if (!error) return false;
  const message = String(error.message || "").toLowerCase();
  return (
    message.includes("connect") ||
    message.includes("econnrefused") ||
    message.includes("database") ||
    message.includes("timeout") ||
    message.includes("relation") ||
    message.includes("does not exist")
  );
};

exports.register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const { username, email, password } = parsed.data;
    const exists = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [
      email,
      username,
    ]);
    if (exists.rows.length) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = signTokens(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({ user, accessToken });
  } catch (error) {
    console.error("Register Error:", error);
    if (isDbConnectionError(error)) {
      return res.status(503).json({ message: "Database unavailable or unseeded. Try demo login: alice@flippearn.dev / Demo@123" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const { email, password } = parsed.data;
    const result = await pool.query(
      "SELECT id, username, email, password_hash, role, created_at FROM users WHERE email = $1",
      [email]
    );
    if (!result.rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = signTokens(user);
    setRefreshCookie(res, refreshToken);
    delete user.password_hash;

    return res.status(200).json({ user, accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    const { email, password } = req.body || {};
    if (email === "alice@flippearn.dev" && password === "Demo@123") {
      const { accessToken, refreshToken } = signTokens(demoUser);
      setRefreshCookie(res, refreshToken);
      return res.status(200).json({ user: demoUser, accessToken, demoMode: true });
    }
    if (isDbConnectionError(error)) {
      return res.status(503).json({ message: "Database unavailable or unseeded. Use demo login: alice@flippearn.dev / Demo@123" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const result = await pool.query("SELECT id, email, role FROM users WHERE id = $1", [decoded.id]);
    if (!result.rows.length) return res.status(401).json({ message: "Invalid refresh token" });

    const user = result.rows[0];
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    if (req.cookies.refreshToken) {
      try {
        const decoded = jwt.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_SECRET);
        if (decoded.id === 999) {
          const accessToken = jwt.sign(
            { id: demoUser.id, email: demoUser.email, role: demoUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );
          return res.status(200).json({ accessToken });
        }
      } catch (_) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    }
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = async (_req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

exports.me = async (req, res) => {
  try {
    if (req.user.id === 999) {
      return res.status(200).json({
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
        avatar_url: "https://i.pravatar.cc/150?img=11",
        bio: "Demo mode user",
        created_at: demoUser.created_at,
        is_verified: true,
        role: demoUser.role,
      });
    }
    const result = await pool.query(
      "SELECT id, username, email, avatar_url, bio, created_at, is_verified, role FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    if (isDbConnectionError(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
