const mongoose = require('mongoose');

const savedComparisonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    colleges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true,
      },
    ],
    name: {
      type: String,
      default: 'Saved Comparison',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedComparison', savedComparisonSchema);
