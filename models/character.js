const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Character = sequelizeDB.define('character', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  background: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['acolyte', 'criminal', 'folk_hero', 'noble', 'sage', 'soldier']
  },
  additional_info: {
    type: Sequelize.STRING(4000),
    allowNull: true,
    validate: {
      len: [0, 4000]
    }
  },
  race: {
    type: Sequelize.STRING,
    allowNull: false
  },
  class: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Character;
