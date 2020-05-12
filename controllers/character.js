const Character = require('../models/character');
const Abilities = require('../models/abilities');
const Equipment = require('../models/equipment');
const Traits = require('../models/traits');

const extractCharacterData = require('../utils/extractCharacterData');
const destroyByCharacterId = require('../utils/destroy-by-characterId');

exports.getCharacters = async (req, res, next) => {
  const currentBatch = +req.query.batch || 1;
  const resultLimit = 10;
  const userId = req.user.id;

  try {
    const totalCharacters = await Character.count({
      where: { userId: userId },
    });
    const characters = await Character.findAll({
      where: { userId: userId },
      limit: resultLimit,
      offset: (currentBatch - 1) * resultLimit,
      order: [['id', 'DESC']],
    });

    const charactersResponseDetails = characters.map((character) =>
      extractCharacterData(character)
    );

    return res.status(200).json({
      message: 'Fetched characters successfully.',
      characters: charactersResponseDetails,
      totalCharacters,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.getCharacter = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    const characterResponseDetails = extractCharacterData(character);

    return res.status(200).json({
      message: 'Fetched character successfully.',
      character: characterResponseDetails,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.addCharacter = async (req, res, next) => {
  const { name, background, additional_info, raceType, classType } = req.body;
  const userId = req.user.id;

  try {
    const character = await Character.create({
      name,
      background,
      additional_info,
      raceType,
      classType,
      userId,
    });

    const characterResponseDetails = extractCharacterData(character);

    return res.status(201).json({
      message: 'Created character successfully.',
      character: characterResponseDetails,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.editCharacter = async (req, res, next) => {
  const id = req.params.characterId;

  const { name, background, additional_info, raceType, classType } = req.body;

  try {
    const updatedCharacter = await Character.update(
      { name, background, additional_info, raceType, classType },
      { where: { id: id } }
    );

    const characterResponseDetails = extractCharacterData(updatedCharacter);

    return res.status(200).json({
      message: 'Updated character successfully.',
      character: characterResponseDetails,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.deleteCharacter = async (req, res, next) => {
  const id = req.params.characterId;

  try {
    await Character.destroy({ where: { id: id } });
    await destroyByCharacterId(Abilities, id);
    await destroyByCharacterId(Equipment, id);
    await destroyByCharacterId(Traits, id);

    return res.status(200).json({ message: 'Removed character successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
