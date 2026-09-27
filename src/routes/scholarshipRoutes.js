const express = require('express');
const router = express.Router();
const { matchScholarships } = require('../controllers/scholarshipController');

router.get('/match', matchScholarships);

module.exports = router;
