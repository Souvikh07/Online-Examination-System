const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: [(v) => v.length >= 2, 'At least two options required'],
    },
    correctOptionIndex: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

questionSchema.pre('validate', function (next) {
  if (this.options && this.correctOptionIndex >= this.options.length) {
    this.invalidate('correctOptionIndex', 'Index out of range for options');
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
