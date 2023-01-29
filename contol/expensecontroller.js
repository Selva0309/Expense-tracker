
const { group } = require('console');
const path = require('path');
const { where } = require('sequelize');
const Expenses = require('../model/Expenses');
const User = require('../model/user');
const sequelize = require('../utils/database');

exports.addexpense = (req,res,next)=>{
    const description = req.body.description;
    const category = req.body.category;
    const amount = req.body.amount;
    const type = req.body.type;
    // console.log(description,category,amount);
    req.user.createExpense({
    description: description,
    category: category,
    amount: amount,
    type: type
    })
    .then(result =>{
    // console.log('Created expense');
    res.status(200).json({success:true, message:"Expense added successfully"})
    }).catch(err=>console.log(err))
};

exports.countExpense= (req,res,next)=>{
    try{
        req.user.getExpenses().then(expenses=>{
            numExpenses = expenses.length;
            next();
        }).catch(err => {
            throw new Error(err)
        })
    } catch(err){
        return res.status(401).json({success: false})
    }
}


exports.expenselist = (req,res,next)=>{
    // console.log("Expense page loaded")
    const page = parseInt(req.header('page'));
    const limit = parseInt(req.header('limit'));
    
    // console.log(page, limit);
    req.user.getExpenses({offset:((page-1)*limit),
        limit : limit,
        subQuery:false}).then(expenses =>{

        res.status(200).json({result: expenses,
            pages: {
                FirstPage: { condition: page>2, value: 1, name: 'First'}, 
                PreviousPage: {condition:page > 1, value: page - 1, name: page - 1},
                currentPage: { condition: page, value: page, name: page},
                NextPage: {condition:limit * page <numExpenses, value: page+1, name:page+1},                
                lastPage: { condition: (page+1)<Math.ceil(numExpenses / limit), value: Math.ceil(numExpenses / limit), name: 'Last'},
            }
            
        });
    }).catch(err => console.log(err));

};



exports.updateexpense=(req,res,next) =>{
    const updatedDescription = req.body.description;
    const updatedCategory = req.body.category;
    const updatedamount = req.body.amount;
    const ID = req.body.id;
    Expenses.update({
        description : updatedDescription,
        category : updatedCategory,
        amount : updatedamount
    }, { where : {id : ID}})
    .then(
        res.redirect('/expenselist')
    ).catch(err=>console.log(err))
}

exports.deleteexpense = (req,res,next) =>{
    const expenseID = req.body.expenseId;
    // console.log(expenseID);
    req.user.getExpenses({where: {id : expenseID,}})
        .then(expense=>{
                expense[0].destroy();
            })
    
    
    .then(result=>{
        // console.log('removed expense')
        res.status(200).json({success:true, message:"Expense deleted"})
    }
    ).catch(err=>console.log(err))
}

exports.monthlyreport = async (req, res, next)=>{
    try{
        const monthlyexpenses = await req.user.getExpenses({
            attributes: ['id', 'category', 'type', 'amount', [sequelize.fn('YEAR', sequelize.col('expenses.createdAt')),'year'],
            [sequelize.fn('MONTH', sequelize.col('expenses.createdAt')),'month']],
            order: [[sequelize.col('type'), "DESC"]]
            
        })
        res.status(201).json(monthlyexpenses);
        } catch(err) {
            console.log(err)
        }
            
    }
    
