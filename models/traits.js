const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Traits = sequelizeDB.define(
  'traits',
  {
    ability_score_increase: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    alignment: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['lawful', 'neutral', 'chaotic'],
    },
    morality: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['good', 'neutral', 'evil'],
    },
    size: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['small', 'medium', 'large'],
    },
    speed: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    languages: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['common', 'dwarvish', 'elvish'],
    },
  },
  { freezeTableName: true }
);

module.exports = Traits;
