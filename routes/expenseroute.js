const path = require('path');

const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const UserAuth = require('../middleware/authentication');

const expensecontroller = require('../contol/expensecontroller');


router.post('/addexpense', UserAuth.authenticate, expensecontroller.addexpense);
router.get('/expenselist', UserAuth.authenticate, expensecontroller.expenselist);

router.post('/update-expense', expensecontroller.updateexpense);
router.post('/delete-expense', UserAuth.authenticate, expensecontroller.deleteexpense);


module.exports = router;
