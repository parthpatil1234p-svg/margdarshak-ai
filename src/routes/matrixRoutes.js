const express = require('express');
const router = express.Router();
const { comparePathways } = require('../controllers/matrixController');

router.post('/compare', comparePathways);

module.exports = router;
