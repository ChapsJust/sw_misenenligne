const mysql = require('mysql');
const dotenv = require('dotenv');
const pool = require("../config/db");

const getPokemonById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM pokemon WHERE id = $1`;

    pool.query(query, [id])
      .then(results => {
        if (results.rows.length === 0) {
          reject(new Error(`Le pokemon id ${id} n'existe pas dans la base de données`));
        } else {
          resolve(results.rows[0]);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAllPokemons = (page, type) => {
  return new Promise((resolve, reject) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    const params = [type, offset];
    let query = `SELECT * FROM pokemon WHERE lower(type_primaire) = $1 LIMIT 25 offset $2`;
    console.log(type);
    pool.query(query, params, (error, results) => {
      console.log(results.rows);
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

const addPokemon = (newPokemon) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO pokemon SET $1';
    // NOTE : Si j'envois un objet avec des propriétés qui ne sont pas dans la table pokemon, ça va planter
    pool.query(query, newPokemon, (error, results) => {
      if (error) {
        reject(error);
      } else {
        const insertedId = results.insertId;
        resolve({ id: insertedId, ...newPokemon });
      }
    });
  });
};

const updatePokemon = (id, updatedPokemon) => {
  return new Promise((resolve, reject) => {
    // NOTE : Si j'envois un objet avec des propriétés qui ne sont pas dans la table pokemon, ça va planter
    const query = 'UPDATE pokemon SET $1 WHERE id = $2';
    pool.query(query, [updatedPokemon, id], (error, results) => {
      if (error) {
        reject(error);
      } else if (results.affectedRows === 0) {
        // NOTE : Si le pokemon n'existe pas, ça va être considéré comme un succès mais tu auras un tableau vide
        reject({ status: 404, message: `Le pokemon id ${id} n'existe pas dans la base de données` });
      } else {
        resolve({ id, ...updatedPokemon });
      }
    });
  });
};

const deletePokemon = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM pokemon WHERE id = ?';
    pool.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else if (results.affectedRows === 0) {
        // NOTE : Si le pokemon n'existe pas, ça va être considéré comme un succès mais tu auras un tableau vide
        reject({ status: 404, message: `Le pokemon id ${id} n'existe pas dans la base de données` });
      } else {
        resolve({ id, ...results });
      }
    });
  });
};

module.exports = {
  getPokemonById,
  getAllPokemons,
  addPokemon,
  updatePokemon,
  deletePokemon,
};