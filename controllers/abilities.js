const Character = require('../models/character');
const Abilities = require('../models/abilities');

exports.getAbilities = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const abilities = await Abilities.findAll({
      where: { characterId: characterId },
    });

    return res.status(200).json({
      message: "Fetched character's abilities successfully.",
      abilities,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.addAbilities = async (req, res, next) => {
  const characterId = req.params.characterId;
  const {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
  } = req.body;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const ability = await Abilities.create({
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      characterId,
    });

    return res.status(201).json({
      message: 'Created character abilities successfully.',
      ability,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.editAbilities = async (req, res, next) => {
  const characterId = req.params.characterId;
  const {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
  } = req.body;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const ability = await Abilities.update(
      { strength, dexterity, constitution, intelligence, wisdom, charisma },
      {
        where: { characterId: characterId },
      }
    );

    return res.status(200).json({
      message: 'Updated character abilities successfully.',
      ability,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.deleteAbilities = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    await Abilities.destroy({
      where: { characterId: characterId },
    });

    return res.status(200).json({
      message: 'Removed character abilities successfully.',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
