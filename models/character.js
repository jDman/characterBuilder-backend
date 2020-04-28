const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Character = sequelizeDB.define('character', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  background: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['acolyte', 'criminal', 'folk_hero', 'noble', 'sage', 'soldier'],
  },
  additional_info: {
    type: Sequelize.STRING(4000),
    allowNull: false,
    defaultValue: '',
    validate: {
      len: [0, 4000],
    },
  },
  raceType: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['human', 'elf', 'dwarf'],
  },
  classType: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['warrior', 'rogue', 'mage'],
  },
});

module.exports = Character;
