const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const characterController = require('../controllers/character');

router.get('/character/:characterId', characterController.getCharacter);

router.get('/characters', characterController.getCharacters);

router.post(
  'character/add',
  [body('name').trim().isAlphanumeric()],
  [body('background').trim().isAlphanumeric()],
  [body('raceType').trim().isAlphanumeric()],
  [body('classType').trim().isAlphanumeric()],
  characterController.addCharacter
);

router.put(
  'character/add',
  [body('name').trim().isAlphanumeric()],
  [body('background').trim().isAlphanumeric()],
  [body('raceType').trim().isAlphanumeric()],
  [body('classType').trim().isAlphanumeric()],
  characterController.updateCharacter
);

router.delete('/character/remove', characterController.deleteCharacter);

module.exports = router;
