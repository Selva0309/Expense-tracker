const path = require('path');
const express = require('express');

const router = express.Router();

const Expenses = require('../model/Data');

const expensecontroller = require('../contol/controller');
const usercontroller = require('../contol/usercontroller');


router.post('/user/signup', usercontroller.adduser);
router.post('/user/login', usercontroller.loginuser);

module.exports = router;
