const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const equipmentController = require('../controllers/equipment');

router.get('/equipment/:characterId', equipmentController.getEquipment);

router.post(
  '/equipment/add/:characterId',
  [body('armor_class').isNumeric()],
  [body('weapon_proficiencies').isAlphanumeric()],
  [body('wealth').isNumeric()],
  equipmentController.addEquipment
);

router.put(
  '/equipment/edit/:characterId',
  [body('armor_class').isNumeric()],
  [body('weapon_proficiencies').isAlphanumeric()],
  [body('wealth').isNumeric()],
  equipmentController.editEquipment
);

router.delete(
  '/equipment/remove/:characterId',
  equipmentController.deleteEquipment
);

module.exports = router;
