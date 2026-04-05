const express = require('express');
const { submitAttempt, myAttempts, getAttemptResult } = require('../controllers/attemptController');
const { protect, studentOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/mine', protect, studentOnly, myAttempts);
router.post('/:attemptId/submit', protect, studentOnly, submitAttempt);
router.get('/:attemptId/result', protect, studentOnly, getAttemptResult);

module.exports = router;
