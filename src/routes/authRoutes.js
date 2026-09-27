const express = require('express');
const router = express.Router();
const {
  register,
  login,
  demoJudgeLogin,
  getMe,
  saveRoadmap,
  getSavedRoadmaps,
  deleteSavedRoadmap
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-judge-login', demoJudgeLogin);
router.get('/me', getMe);
router.post('/save-roadmap', saveRoadmap);
router.get('/saved-roadmaps', getSavedRoadmaps);
router.delete('/saved-roadmaps/:id', deleteSavedRoadmap);

module.exports = router;
