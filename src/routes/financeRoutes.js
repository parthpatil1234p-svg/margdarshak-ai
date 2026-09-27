const express = require('express');
const router = express.Router();
const { calculateLoan, getInstitutions } = require('../controllers/financeController');

router.post('/calculate-loan', calculateLoan);
router.get('/institutions', getInstitutions);

module.exports = router;
