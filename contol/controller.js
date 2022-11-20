const path = require('path');
const { where } = require('sequelize');
const Expenses = require('../model/Data');


exports.addexpense = (req,res,next)=>{
    const description = req.body.description;
    const category = req.body.category;
    const amount = req.body.amount;
    Expenses.create({
    description: description,
    category: category,
    amount: amount
    })
    .then(result =>{
    console.log('Created expense');
    res.redirect('/expenselist');
    }).catch(err=>console.log(err))
};

exports.getindex = (req,res,next)=>{
    res.render('main',{
        pageTitle: 'Expense Tracker',
        path: '/'
    })
};

exports.expenselist = (req,res,next)=>{
    console.log("Expense page loaded")
    Expenses.findAll().then(expenses =>{
        
        res.render('expenses',{
            prods: expenses,
            pageTitle: 'Expenses',
            path: '/expenselist'
        });
    }).catch(err => console.log(err));
    
};

exports.geteditexpense = (req,res,next)=> {
    const expenseID = req.body.expenseId;
    console.log(expenseID);
    Expenses.findAll({where : {id : expenseID}})
    .then(expenses=>{
            console.log(expenses)
            res.render('edit-expense', {
            pageTitle: 'Editing the expense',
            prods: expenses[0],
            path : '/expense-edit'
        })
    }) 

}

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

    Expenses.findByPk(expenseID)
    .then(expenses=>{
    
    return expenses.destroy()
    })
    .then(result=>{
        console.log('removed expense')
        res.redirect('/expenselist')
    }
    ).catch(err=>console.log(err))
}