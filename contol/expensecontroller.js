
const path = require('path');
const { where } = require('sequelize');
const Expenses = require('../model/Expenses');
const User = require('../model/user');


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
    console.log('Created expense');
    res.status(200).json({success:true, message:"Expense added successfully"})
    }).catch(err=>console.log(err))
};



exports.expenselist = (req,res,next)=>{
    console.log("Expense page loaded")
    req.user.getExpenses().then(expenses =>{
        
        // res.render('expenses',{
        //     prods: expenses,
        //     pageTitle: 'Expenses',
        //     path: '/expenselist'
        // });
        res.status(200).json({result: expenses});
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
        console.log('removed expense')
        res.status(200).json({success:true, message:"Expense deleted"})
    }
    ).catch(err=>console.log(err))
}