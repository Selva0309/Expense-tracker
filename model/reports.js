const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Report = sequelize.define('reports', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      filename : Sequelize.STRING
    })

module.exports = Report;