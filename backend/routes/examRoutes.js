const express = require('express');
const {
  createExam,
  listExams,
  getExamById,
  updateExam,
  deleteExam,
} = require('../controllers/examController');
const { startAttempt } = require('../controllers/attemptController');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, listExams);
router.post('/:id/start', protect, studentOnly, startAttempt);
router.get('/:id', protect, getExamById);
router.post('/', protect, adminOnly, createExam);
router.put('/:id', protect, adminOnly, updateExam);
router.delete('/:id', protect, adminOnly, deleteExam);

module.exports = router;
