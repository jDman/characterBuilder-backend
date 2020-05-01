const Character = require('../models/character');
const Traits = require('../models/traits');

exports.getTraits = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const [traits] = await Traits.findAll({
      where: { characterId: characterId },
    });

    return res.status(200).json({
      message: "Fetched character's traits successfully.",
      traits,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.addTraits = async (req, res, next) => {
  const characterId = req.params.characterId;
  const {
    ability_score_increase,
    age,
    alignment,
    morality,
    size,
    speed,
    languages,
  } = req.body;

  try {
    const character = Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const traits = await Traits.create({
      ability_score_increase,
      age,
      alignment,
      morality,
      size,
      speed,
      languages,
      characterId,
    });

    return res.status(201).json({
      message: 'Created character traits successfully.',
      traits,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.editTraits = async (req, res, next) => {
  const characterId = req.params.characterId;
  const {
    ability_score_increase,
    age,
    alignment,
    morality,
    size,
    speed,
    languages,
  } = req.body;

  try {
    const character = Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const traits = await Traits.update(
      {
        ability_score_increase,
        age,
        alignment,
        morality,
        size,
        speed,
        languages,
      },
      {
        where: { characterId: characterId },
      }
    );

    return res.status(200).json({
      message: 'Updated character traits successfully.',
      traits,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.deleteTraits = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    await Traits.destroy({
      where: { characterId: characterId },
    });

    return res.status(200).json({
      message: 'Removed character traits successfully.',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
