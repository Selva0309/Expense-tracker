const path = require('path');

const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const UserAuth = require('../middleware/authentication');

const expensecontroller = require('../contol/expensecontroller');


router.post('/expenses', UserAuth.authenticate, expensecontroller.addexpense);
router.get('/expenselist', UserAuth.authenticate, expensecontroller.expenselist);
router.post('/edit-expense', expensecontroller.geteditexpense);
router.post('/update-expense', expensecontroller.updateexpense);
router.post('/delete-expense', UserAuth.authenticate, expensecontroller.deleteexpense);
router.use('/', expensecontroller.getindex);

module.exports = router;
