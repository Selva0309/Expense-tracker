const path = require('path');
const express = require('express');


const router = express.Router();

const uuid = require('../middleware/uuid');
const passwordcontroller = require('../contol/passwordcontroller');

router.get('/updatepassword/:resetpasswordid', passwordcontroller.updatepassword)

router.get('/resetpassword/:id',passwordcontroller.resetpassword)
router.post('/forgotpassword', uuid.idgenerate, passwordcontroller.forgotpassword);


module.exports = router;
