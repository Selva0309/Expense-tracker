const path = require('path');
const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const User = require('../model/user');


const premiumcontroller = require('../contol/premiumcontroller');


router.get('/premium/dashboard', premiumcontroller.getdashboard);


module.exports = router;
