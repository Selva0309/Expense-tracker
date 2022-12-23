const User = require('../model/user');
const Expenses = require('../model/Expenses');
const { Model } = require('sequelize');

exports.getdashboard = (req,res,next) =>{
    Expenses.findAll({include: [{model: User, attributes:['name']}]})
    .then(expenses=>{
        
        res.status(201).json(expenses);
    }).catch(err=>{
        console.log(err);
    })
}