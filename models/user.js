const Sequelize = require('sequelize');
const sequelizeDB = require('../database/connection');

const User = sequelizeDB.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  gravatar_hash: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;
