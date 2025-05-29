// backend/middleware/verifyToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({ error: "Token manquant ou mal formé" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userData = { id: decoded.id, isAdmin: decoded.isAdmin };
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expiré" : "Token invalide";
    res.status(401).json({ error: message });
  }
};
