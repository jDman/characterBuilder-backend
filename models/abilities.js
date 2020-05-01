const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Abilities = sequelizeDB.define(
  'abilities',
  {
    strength: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dexterity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    constitution: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    intelligence: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    wisdom: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    charisma: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Abilities;
