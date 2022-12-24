const User = require('../model/user');
const Expenses = require('../model/Expenses');
const { Model } = require('sequelize');
const sequelize = require('../utils/database');

exports.getdashboard = async (req,res,next) =>{
    try{
    const leaderboardUsers = await User.findAll({
        attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')),'total_cost']],
        include: [
            { model: Expenses, 
                attributes:[]
            }],
        group: ['User.id'],
        order: [[sequelize.col('total_cost'), "DESC"]]
    })
    res.status(201).json(leaderboardUsers);
    } catch(err) {
        console.log(err)
    }
        
}