const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing access token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

const requireSelfOrAdmin = (req, res, next) => {
  const paramId = Number(req.params.id);
  if (req.user.id === paramId || req.user.role === "admin") return next();
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = { verifyAccessToken, requireSelfOrAdmin };
