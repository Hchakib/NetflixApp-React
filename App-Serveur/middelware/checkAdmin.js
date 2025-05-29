// backend/middleware/verifyToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (!req.userData || !req.userData.isAdmin) {
      return res
        .status(403)
        .json({ error: "Accès réservé aux administrateurs" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Erreur d’authentification" });
  }
};
