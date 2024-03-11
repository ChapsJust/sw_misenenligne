const pool = require("../config/db");

const apiAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erreur: "Aucune clé API fournie" });
  }

  const cle_api = authHeader.split(" ")[1];
  const query = "SELECT * FROM utilisateurs WHERE cle_api = ?";
  pool.query(query, [cle_api], (error, results) => {
    if (error || results.length === 0) {
      return res.status(401).json({ erreur: "Clé API invalide" });
    }
    next();
  });
};
