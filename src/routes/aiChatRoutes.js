const express = require('express');
const router = express.Router();
const { handleAICounselorChat } = require('../controllers/aiChatController');

router.post('/chat', handleAICounselorChat);

module.exports = router;
