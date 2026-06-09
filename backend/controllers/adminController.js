const College = require('../models/College');

// GET /api/admin/colleges - List all colleges with full data for management
exports.getAdminColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/admin/colleges - Add a new college
exports.addAdminCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, message: 'College added successfully.', data: college });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to add college.', error: err.message });
  }
};

// PUT /api/admin/colleges/:id - Edit a college
exports.updateAdminCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });
    res.json({ success: true, message: 'College updated successfully.', data: college });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Update failed.', error: err.message });
  }
};

// DELETE /api/admin/colleges/:id - Delete a college
exports.deleteAdminCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });
    res.json({ success: true, message: 'College deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deletion failed.', error: err.message });
  }
};

// GET /api/admin/reviews - Get all reviews across all colleges for moderation
exports.getAdminReviews = async (req, res) => {
  try {
    const colleges = await College.find({}, 'name reviews');
    const allReviews = colleges.reduce((acc, college) => {
      const collegeReviews = college.reviews.map(rev => ({
        ...rev.toObject(),
        collegeName: college.name,
        collegeId: college._id
      }));
      return [...acc, ...collegeReviews];
    }, []);
    
    // Sort by date descending
    allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, data: allReviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.', error: err.message });
  }
};
