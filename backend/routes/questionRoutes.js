const express = require('express');
const { addQuestion, listQuestionsForExam } = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/', protect, listQuestionsForExam);
router.post('/', protect, adminOnly, addQuestion);

module.exports = router;
