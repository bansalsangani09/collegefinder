const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    location: { type: String, required: true },   // "Bangalore, Karnataka"
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: { type: String, enum: ['Government', 'Private', 'Deemed', 'Autonomous'], default: 'Private' },
    established: Number,
    ranking: Number,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    logo: { type: String, default: '' },
    image: { type: String, default: '' },       // Thumbnail for cards
    bannerImage: { type: String, default: '' }, // Full-width hero banner
    overview: { type: String, default: '' },
    fees: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    courses: [
      {
        name: String,
        duration: String,
        fees: Number,
      },
    ],
    placement: {
      averagePackage: Number,   // in LPA
      highestPackage: Number,   // in LPA
      placementRate: Number,    // percentage
      topRecruiters: [String],
    },
    reviews: [reviewSchema],
    cutoffs: [
      {
        exam: { type: String },
        rank: { type: Number },
        year: { type: Number, default: 2026 }
      }
    ],
    tags: [String],             // e.g. ["Engineering", "MBA", "Top Ranked"]
  },
  { timestamps: true }
);

// Auto-generate slug from name
collegeSchema.pre('save', async function () {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

module.exports = mongoose.model('College', collegeSchema);
