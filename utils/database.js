const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker', 'root', 'Wgm@03s17', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;