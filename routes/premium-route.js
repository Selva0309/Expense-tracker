const path = require('path');
const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const User = require('../model/user');
const UserAuth = require('../middleware/authentication');


const premiumcontroller = require('../contol/premiumcontroller');


router.get('/dashboard', premiumcontroller.getdashboard);
router.get('/download', UserAuth.authenticate, premiumcontroller.downloadreport)
router.get('/getreport', UserAuth.authenticate, premiumcontroller.getreports)


module.exports = router;
