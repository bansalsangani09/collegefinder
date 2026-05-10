const mongoose = require('mongoose');

const savedCollegeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves
savedCollegeSchema.index({ userId: 1, collegeId: 1 }, { unique: true });

module.exports = mongoose.model('SavedCollege', savedCollegeSchema);
