const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const traitsController = require('../controllers/traits');

const isAuth = require('../middleware/is-auth');

router.get('/traits/:characterId', isAuth, traitsController.getTraits);

router.post(
  '/traits/add/:characterId',
  [body('ability_score_increase').isNumeric()],
  [body('age').isNumeric()],
  [body('alignment').isAlphanumeric()],
  [body('morality').isAlphanumeric()],
  [body('size').isAlphanumeric()],
  [body('speed').isNumeric()],
  [body('languages').isAlphanumeric()],
  isAuth,
  traitsController.addTraits
);

router.put(
  '/traits/edit/:characterId',
  [body('strength').isNumeric()],
  [body('dexterity').isNumeric()],
  [body('constitution').isNumeric()],
  [body('intelligence').isNumeric()],
  [body('wisdom').isNumeric()],
  [body('charisma').isNumeric()],
  isAuth,
  traitsController.editTraits
);

router.delete(
  '/traits/remove/:characterId',
  isAuth,
  traitsController.deleteTraits
);

module.exports = router;
