const express = require('express');
const { submitAttempt, myAttempts, getAttemptResult, getExamAttemptsForAdmin } = require('../controllers/attemptController');
const { protect, studentOnly, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/mine', protect, studentOnly, myAttempts);
router.post('/:attemptId/submit', protect, studentOnly, submitAttempt);
router.get('/:attemptId/result', protect, studentOnly, getAttemptResult);
router.get('/exam/:examId', protect, adminOnly, getExamAttemptsForAdmin);

module.exports = router;
