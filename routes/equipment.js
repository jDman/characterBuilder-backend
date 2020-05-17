const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const equipmentController = require('../controllers/equipment');

const isAuth = require('../middleware/is-auth');

router.get('/equipment/:characterId', isAuth, equipmentController.getEquipment);

router.post(
  '/equipment/add/:characterId',
  [body('armor_class').isNumeric()],
  [body('weapon_proficiencies').isAlphanumeric()],
  [body('wealth').isNumeric()],
  isAuth,
  equipmentController.addEquipment
);

router.put(
  '/equipment/edit/:characterId',
  [body('armor_class').isNumeric()],
  [body('weapon_proficiencies').isAlphanumeric()],
  [body('wealth').isNumeric()],
  isAuth,
  equipmentController.editEquipment
);

router.delete(
  '/equipment/remove/:characterId',
  isAuth,
  equipmentController.deleteEquipment
);

module.exports = router;
