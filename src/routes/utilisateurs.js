const express = require("express");
const router = express.Router();
const utilisateursController = require("../controllers/utilisateursController");
const apiAuthMiddleware = require("../middleware/authentificationApi");

router.post(
  "/ajouter",
  apiAuthMiddleware,
  utilisateursController.ajouterUtilisateur
);

router.get("/cle", utilisateursController.getCleApi);

module.exports = router;
