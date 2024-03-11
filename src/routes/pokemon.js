const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');

// Afficher une liste paginée de tous les pokemons
router.get('/liste', pokemonController.getAllPokemons);

// Ajouter un pokemon
router.post('/', pokemonController.addPokemon);

// Afficher un pokemon par son id
router.get('/:id', pokemonController.getPokemonById);

// Modifier un pokemon
router.put('/:id', pokemonController.updatePokemon);

// Supprimer un pokemon
router.delete('/:id', pokemonController.deletePokemon);

module.exports = router;