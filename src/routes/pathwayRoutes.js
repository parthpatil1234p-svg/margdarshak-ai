const express = require('express');
const router = express.Router();
const { getStreams, simulateStudentPathways } = require('../controllers/pathwayController');

router.get('/streams', getStreams);
router.post('/simulate', simulateStudentPathways);

module.exports = router;
