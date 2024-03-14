
const pokemonModel = require('../models/pokemonModel');

const getPokemonById = async (req, res) => {
  try {
    const id = req.params.id;
    const pokemon = await pokemonModel.getPokemonById(id);

    if (pokemon.length === 0) {
      return res.status(404).json({ erreur: `Aucun pokemon trouvé avec l'id ${req.params.id}` });
    }

    res.status(200).json({
      message: `Pokemon trouvé avec succès`,
      resultat : {
      id: pokemon[0].id,
      nom: pokemon[0].nom,
      type_primaire: pokemon[0].type_primaire
      }  
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: `Echec lors de la récupération du pokemon avec l'id ${req.params.id}` });
  }
};

const getAllPokemons = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const type = req.query.type || '';
    const pokemons = await pokemonModel.getAllPokemons(page, type.toLowerCase());

    res.status(200).json(pokemons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Echec lors de la récupération de la liste des pokemons' });
  }
};

const addPokemon = async (req, res) => {
  try {
    const newPokemon = req.body;
    // Note : La validation des données devrait être faite ici avant d'ajouter le pokemon
    // Note : Erreur si des données obligatoires sont manquantes
    const addedPokemon = await pokemonModel.addPokemon(newPokemon);
    
    res.status(201).json({ message: `Le pokemon ${addedPokemon.nom} a été ajouté avec succès`, pokemon: addedPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: `Echec lors de la création du pokemon ${req.body.nom}` });
  }
};

const updatePokemon = async (req, res) => {
  try {
    const id = req.params.id;
    // Note : La validation des données devrait être faite ici avant de modifier le pokemon
    const updatedPokemon = await pokemonModel.updatePokemon(id, req.body);
    // Note : Erreur 404 si le pokemon n'existe pas
    res.status(200).json({ message: `Le pokemon id ${id} a été modifié avec succès`, pokemon: updatedPokemon });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: `Echec lors de la modification du pokemon id ${req.params.id}` });
  }
};

const deletePokemon = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPokemon = await pokemonModel.deletePokemon(id);
    // Note : Erreur 404 si le pokemon n'existe pas
    res.status(200).json({ message: `Le pokemon id ${id} a été supprimé avec succès`, pokemon: deletedPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: `Echec lors de la suppression du pokemon id ${req.params.id}` });
  }
};

module.exports = {
  getPokemonById,
  getAllPokemons,
  addPokemon,
  updatePokemon,
  deletePokemon,
};