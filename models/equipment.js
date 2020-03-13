const Equipment = sequelize.define('equipment', {
  armor_class: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  weapon_proficiency: : {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false
  },
  wealth: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

}, { freezeTableName: true });

module.exports = Equipment;
