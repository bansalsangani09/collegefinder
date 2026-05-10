const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorName: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    authorName: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // optional, if linking to specific college
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
