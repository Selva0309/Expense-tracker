const path = require('path');
const express = require('express');


const router = express.Router();

const uuid = require('../middleware/uuid');
const passwordcontroller = require('../contol/passwordcontroller');

router.get('/password/updatepassword/:resetpasswordid', passwordcontroller.updatepassword)

router.get('/password/resetpassword/:id',passwordcontroller.resetpassword)
router.post('/password/forgotpassword', uuid.idgenerate, passwordcontroller.forgotpassword);


module.exports = router;
