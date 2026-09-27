const express = require('express');
const router = express.Router();
const { getScenarios, executeWhatIfSimulation } = require('../controllers/whatIfController');

router.get('/scenarios', getScenarios);
router.post('/simulate', executeWhatIfSimulation);

module.exports = router;
