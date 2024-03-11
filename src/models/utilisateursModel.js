const mysql = require("mysql");
const dotenv = require("dotenv");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const ajouterUtilisateur = async (nom, courriel, mot_de_passe) => {
  const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);
  const cle_api = uuidv4();

  const query = `INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [nom, courriel, hashedPassword, cle_api],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({ cle_api: cle_api });
        }
      }
    );
  });
};

const chercherOuCreerCleApi = async (
  courriel,
  mot_de_passe,
  genererNouvelleCle = false
) => {
  return new Promise((resolve, reject) => {
    // D'abord, vérifier si l'utilisateur existe et récupérer la clé API existante
    const querySelect = `SELECT cle_api FROM utilisateurs WHERE courriel = ? AND mot_de_passe = ?`;
    pool.query(querySelect, [courriel, mot_de_passe], (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        // Aucun utilisateur correspondant trouvé
        reject(new Error("Utilisateur non trouvé"));
      } else if (genererNouvelleCle) {
        // Générer une nouvelle clé API et la mettre à jour dans la base de données
        const nouvelleCleApi = uuidv4();
        const queryUpdate = `UPDATE utilisateurs SET cle_api = ? WHERE courriel = ? AND mot_de_passe = ?`;
        pool.query(
          queryUpdate,
          [nouvelleCleApi, courriel, mot_de_passe],
          (errorUpdate, resultsUpdate) => {
            if (errorUpdate) {
              reject(errorUpdate);
            } else {
              resolve({ cle_api: nouvelleCleApi });
            }
          }
        );
      } else {
        // Retourner la clé API existante
        resolve(results[0]);
      }
    });
  });
};

const validerCourriel = (courriel) => {
  return new Promise((resolve, reject) => {
    const query = `Select count(*) FROM utilisateurs WHERE courriel = ?`;
    pool.query(query, [courriel], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0] > 0);
      }
    });
  });
};

module.exports = {
  ajouterUtilisateur,
  validerCourriel,
  chercherOuCreerCleApi,
};
