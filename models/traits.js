const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Traits = sequelizeDB.define(
  'traits',
  {
    ability_score_increase: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    alignment: {
      type: Sequelize.STRING,
      allowNull: false
    },
    size: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['small', 'medium', 'large']
    },
    speed: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    languages: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false
    }
  },
  { freezeTableName: true }
);

module.exports = Traits;
