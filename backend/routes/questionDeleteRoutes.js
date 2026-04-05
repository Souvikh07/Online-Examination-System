const express = require('express');
const { deleteQuestion } = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.delete('/:questionId', protect, adminOnly, deleteQuestion);

module.exports = router;
