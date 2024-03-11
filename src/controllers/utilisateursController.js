const utilisateursModel = require("../models/utilisateursModel");

const ajouterUtilisateur = async (req, res) => {
  const { nom, courriel, mot_de_passe } = req.body;

  if (!nom || !courriel || !mot_de_passe) {
    return res
      .status(400)
      .json({ erreur: "Un ou plusieurs champs obligatoires sont manquants" });
  }

  try {
    const emailExists = await utilisateursModel.validerCourriel(courriel);
    if (emailExists) {
      return res.status(400).json({ erreur: "Le courriel existe déjà" });
    }

    const cle_api = await utilisateursModel.ajouterUtilisateur(
      nom,
      courriel,
      mot_de_passe
    );
    res
      .status(201)
      .json({ message: "Utilisateur ajouté avec succès", cle_api });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ erreur: "Erreur lors de l'ajout de l'utilisateur" });
  }
};

module.exports = {
  ajouterUtilisateur,
};
