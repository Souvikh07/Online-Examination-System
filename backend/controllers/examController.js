const Exam = require('../models/Exam');
const Question = require('../models/Question');

const createExam = async (req, res) => {
  try {
    const { title, description, durationMinutes, isPublished } = req.body;
    if (!title || durationMinutes == null) {
      return res.status(400).json({ message: 'Title and durationMinutes are required' });
    }
    const exam = await Exam.create({
      title,
      description: description || '',
      durationMinutes,
      isPublished: Boolean(isPublished),
      createdBy: req.user._id,
    });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listExams = async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { isPublished: true };
    const exams = await Exam.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (req.user.role === 'student' && !exam.isPublished) {
      return res.status(403).json({ message: 'Exam not available' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const { title, description, durationMinutes, isPublished } = req.body;
    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (durationMinutes !== undefined) exam.durationMinutes = durationMinutes;
    if (isPublished !== undefined) exam.isPublished = isPublished;
    await exam.save();
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await Question.deleteMany({ exam: exam._id });
    await exam.deleteOne();
    res.json({ message: 'Exam removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createExam,
  listExams,
  getExamById,
  updateExam,
  deleteExam,
};
