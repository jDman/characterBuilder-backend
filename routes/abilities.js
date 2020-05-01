const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const abilitiesController = require('../controllers/abilities');

router.get('/abilities/:characterId', abilitiesController.getAbilities);

router.post(
  '/abilities/add/:characterId',
  [body('strength').isNumeric()],
  [body('dexterity').isNumeric()],
  [body('constitution').isNumeric()],
  [body('intelligence').isNumeric()],
  [body('wisdom').isNumeric()],
  [body('charisma').isNumeric()],
  abilitiesController.addAbilities
);

router.put(
  '/abilities/edit/:characterId',
  [body('strength').isNumeric()],
  [body('dexterity').isNumeric()],
  [body('constitution').isNumeric()],
  [body('intelligence').isNumeric()],
  [body('wisdom').isNumeric()],
  [body('charisma').isNumeric()],
  abilitiesController.editAbilities
);

router.delete(
  '/abilities/remove/:characterId',
  abilitiesController.deleteAbilities
);

module.exports = router;
