const path = require('path');
const express = require('express');

const router = express.Router();

const passwordcontroller = require('../contol/passwordcontroller');


router.post('/password/forgotpassword', passwordcontroller.forgotpassword);


module.exports = router;
