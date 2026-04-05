const Exam = require('../models/Exam');
const Question = require('../models/Question');

const addQuestion = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId || req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const { questionText, options, correctOptionIndex } = req.body;
    if (!questionText || !Array.isArray(options) || correctOptionIndex === undefined) {
      return res.status(400).json({ message: 'questionText, options[], and correctOptionIndex required' });
    }
    const question = await Question.create({
      exam: exam._id,
      questionText,
      options,
      correctOptionIndex,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const stripCorrect = (q) => {
  const o = q.toObject ? q.toObject() : { ...q };
  delete o.correctOptionIndex;
  return o;
};

const listQuestionsForExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId || req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (req.user.role === 'student' && !exam.isPublished) {
      return res.status(403).json({ message: 'Exam not available' });
    }
    const questions = await Question.find({ exam: exam._id }).sort({ createdAt: 1 });
    if (req.user.role === 'student') {
      return res.json(questions.map(stripCorrect));
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate('exam');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (question.exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await question.deleteOne();
    res.json({ message: 'Question removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addQuestion,
  listQuestionsForExam,
  deleteQuestion,
};
