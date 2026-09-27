const express = require('express');
const router = express.Router();
const { evaluateAssessment } = require('../controllers/assessmentController');

router.post('/evaluate', evaluateAssessment);

module.exports = router;
