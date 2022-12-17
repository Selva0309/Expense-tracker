const path = require('path');

const express = require('express');

const router = express.Router();

const Expenses = require('../model/Data');

const expensecontroller = require('../contol/controller');


router.post('/expenses', expensecontroller.addexpense);
router.get('/expenselist', expensecontroller.expenselist);
router.post('/edit-expense', expensecontroller.geteditexpense);
router.post('/update-expense', expensecontroller.updateexpense);
router.post('/delete-expense', expensecontroller.deleteexpense);
router.use('/', expensecontroller.getindex);

module.exports = router;
