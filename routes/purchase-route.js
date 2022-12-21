const express = require('express');

const router = express.Router();

const Expenses = require('../model/Expenses');
const UserAuth = require('../middleware/authentication');
const purchasecontroller = require('../contol/purchaseController');

router.get('/purchase/premiummembership', UserAuth.authenticate, purchasecontroller.purchasepremium)
router.post('/purchase/updatetransactionstatus', UserAuth.authenticate, purchasecontroller.updatestatus)



module.exports = router;