const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Expenses = sequelize.define('expenses', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category : {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount : {type: Sequelize.INTEGER, allowNull: false}
});

module.exports = Expenses;