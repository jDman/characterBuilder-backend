const Character = require('../models/character');
const Equipment = require('../models/equipment');

const destroyByCharacterId = require('../utils/destroy-by-characterId');

exports.getEquipment = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const [equipment] = await Equipment.findAll({
      where: { characterId: characterId },
    });

    return res.status(200).json({
      message: "Fetched character's equipment successfully.",
      equipment,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.addEquipment = async (req, res, next) => {
  const characterId = req.params.characterId;
  const { armor_class, weapon_proficiencies, wealth } = req.body;

  try {
    const character = Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const equipment = await Equipment.create({
      armor_class,
      weapon_proficiencies,
      wealth,
      characterId,
    });

    return res.status(201).json({
      message: 'Created character equipment successfully.',
      equipment,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.editEquipment = async (req, res, next) => {
  const characterId = req.params.characterId;
  const { armor_class, weapon_proficiencies, wealth } = req.body;

  try {
    const character = Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    const equipment = await Equipment.update(
      {
        armor_class,
        weapon_proficiencies,
        wealth,
      },
      {
        where: { characterId: characterId },
      }
    );

    return res.status(200).json({
      message: 'Updated character equipment successfully.',
      equipment,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.deleteEquipment = async (req, res, next) => {
  const characterId = req.params.characterId;

  try {
    const character = await Character.findByPk(characterId);

    if (!character) {
      const error = new Error('Character not found!');
      error.statusCode = 404;

      throw error;
    }

    await destroyByCharacterId(Equipment, characterId);

    return res.status(200).json({
      message: 'Removed character equipment successfully.',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
