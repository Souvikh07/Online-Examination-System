const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

const GRACE_SECONDS = 30;

const startAttempt = async (req, res) => {
  try {
    const examId = req.params.examId || req.params.id;
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: 'Exam not found or not published' });
    }
    const questions = await Question.find({ exam: exam._id });
    if (questions.length === 0) {
      return res.status(400).json({ message: 'This exam has no questions yet' });
    }

    let attempt = await Attempt.findOne({ student: req.user._id, exam: exam._id });
    if (attempt?.submittedAt) {
      return res.status(400).json({ message: 'You have already submitted this exam' });
    }
    if (!attempt) {
      attempt = await Attempt.create({
        student: req.user._id,
        exam: exam._id,
        totalQuestions: questions.length,
        startedAt: new Date(),
        answers: questions.map((q) => ({ question: q._id, selectedOptionIndex: null })),
      });
    } else {
      attempt.startedAt = new Date();
      attempt.totalQuestions = questions.length;
      attempt.answers = questions.map((q) => {
        const prev = attempt.answers.find((a) => a.question.toString() === q._id.toString());
        return { question: q._id, selectedOptionIndex: prev?.selectedOptionIndex ?? null };
      });
      await attempt.save();
    }

    const safeQuestions = questions.map((q) => {
      const o = q.toObject();
      delete o.correctOptionIndex;
      return o;
    });

    res.json({
      attemptId: attempt._id,
      exam: {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
      },
      questions: safeQuestions,
      startedAt: attempt.startedAt,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Attempt already exists; try again' });
    }
    res.status(500).json({ message: err.message });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers array required' });
    }

    const attempt = await Attempt.findOne({
      _id: req.params.attemptId,
      student: req.user._id,
    }).populate('exam');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    if (attempt.submittedAt) {
      return res.status(400).json({ message: 'Already submitted' });
    }

    const exam = attempt.exam;
    const maxMs = exam.durationMinutes * 60 * 1000 + GRACE_SECONDS * 1000;
    if (Date.now() - new Date(attempt.startedAt).getTime() > maxMs) {
      return res.status(400).json({ message: 'Time limit exceeded' });
    }

    const questions = await Question.find({ exam: exam._id });
    const idSet = new Map(questions.map((q) => [q._id.toString(), q]));

    let score = 0;
    const merged = [];
    for (const q of questions) {
      const submitted = answers.find((a) => a.questionId === q._id.toString());
      const idx = submitted?.selectedOptionIndex;
      const selected = typeof idx === 'number' ? idx : null;
      if (selected === q.correctOptionIndex) {
        score += 1;
      }
      merged.push({ question: q._id, selectedOptionIndex: selected });
    }

    for (const a of answers) {
      if (!idSet.has(a.questionId)) {
        return res.status(400).json({ message: `Invalid question id: ${a.questionId}` });
      }
    }

    attempt.answers = merged;
    attempt.score = score;
    attempt.totalQuestions = questions.length;
    attempt.submittedAt = new Date();
    await attempt.save();

    res.json({
      message: 'Submitted successfully',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: questions.length ? Math.round((score / questions.length) * 10000) / 100 : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const myAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id, submittedAt: { $ne: null } })
      .populate('exam', 'title durationMinutes')
      .sort({ submittedAt: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAttemptResult = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      _id: req.params.attemptId,
      student: req.user._id,
    }).populate('exam', 'title');

    if (!attempt) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (!attempt.submittedAt) {
      return res.status(400).json({ message: 'Exam not submitted yet' });
    }

    const questions = await Question.find({ exam: attempt.exam._id });
    const details = questions.map((q) => {
      const ans = attempt.answers.find((a) => a.question.toString() === q._id.toString());
      return {
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        selectedOptionIndex: ans?.selectedOptionIndex ?? null,
        isCorrect: ans?.selectedOptionIndex === q.correctOptionIndex,
      };
    });

    res.json({
      examTitle: attempt.exam.title,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage:
        attempt.totalQuestions > 0
          ? Math.round((attempt.score / attempt.totalQuestions) * 10000) / 100
          : 0,
      submittedAt: attempt.submittedAt,
      details,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
  myAttempts,
  getAttemptResult,
};
