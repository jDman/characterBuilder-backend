const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const abilitiesController = require('../controllers/abilities');

const isAuth = require('../middleware/is-auth');

router.get('/abilities/:characterId', isAuth, abilitiesController.getAbilities);

router.post(
  '/abilities/add/:characterId',
  [body('strength').isNumeric()],
  [body('dexterity').isNumeric()],
  [body('constitution').isNumeric()],
  [body('intelligence').isNumeric()],
  [body('wisdom').isNumeric()],
  [body('charisma').isNumeric()],
  isAuth,
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
  isAuth,
  abilitiesController.editAbilities
);

router.delete(
  '/abilities/remove/:characterId',
  isAuth,
  abilitiesController.deleteAbilities
);

module.exports = router;
