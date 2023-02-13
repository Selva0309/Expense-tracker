const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const UserAuth = require('../middleware/authentication');
const purchasecontroller = require('../control/purchaseController');

router.get('/premiummembership', UserAuth.authenticate, purchasecontroller.purchasepremium)
router.post('/updatetransactionstatus', UserAuth.authenticate, purchasecontroller.updatestatus)



module.exports = router;