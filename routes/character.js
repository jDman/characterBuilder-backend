const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const characterController = require('../controllers/character');
const isAuth = require('../middleware/is-auth');

router.get('/characters', isAuth, characterController.getCharacters);

router.get('/character/:characterId', isAuth, characterController.getCharacter);

router.post(
  '/character/add',
  [body('name').trim().isAlphanumeric()],
  [body('background').trim().isAlphanumeric()],
  [body('raceType').trim().isAlphanumeric()],
  [body('classType').trim().isAlphanumeric()],
  isAuth,
  characterController.addCharacter
);

router.put(
  '/character/edit/:characterId',
  [body('name').trim().isAlphanumeric()],
  [body('background').trim().isAlphanumeric()],
  [body('raceType').trim().isAlphanumeric()],
  [body('classType').trim().isAlphanumeric()],
  isAuth,
  characterController.editCharacter
);

router.delete(
  '/character/remove/:characterId',
  isAuth,
  characterController.deleteCharacter
);

module.exports = router;
