const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const Equipment = sequelizeDB.define(
  'equipment',
  {
    armor_class: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    weapon_proficiencies: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['simple', 'martial'],
    },
    wealth: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Equipment;
