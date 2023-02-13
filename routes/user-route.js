const path = require('path');
const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const User = require('../model/user');


const usercontroller = require('../control/usercontroller');


router.post('/signup', usercontroller.adduser);
router.post('/login', usercontroller.loginuser);

module.exports = router;
