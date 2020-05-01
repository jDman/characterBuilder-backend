const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const traitsController = require('../controllers/traits');

router.get('/traits', traitsController.getTraits);

router.post(
  '/traits/add/:characterId',
  [body('ability_score_increase').isNumeric()],
  [body('age').isNumeric()],
  [body('alignment').isAlphanumeric()],
  [body('morality').isAlphanumeric()],
  [body('size').isAlphanumeric()],
  [body('speed').isNumeric()],
  [body('languages').isAlphanumeric()],
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
  traitsController.editTraits
);

router.delete('/traits/remove/:characterId', traitsController.deleteTraits);
