const path = require('path');
const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');

const expensecontroller = require('../contol/expensecontroller');
const usercontroller = require('../contol/usercontroller');


router.post('/user/signup', usercontroller.adduser);
router.post('/user/login', usercontroller.loginuser);

module.exports = router;
