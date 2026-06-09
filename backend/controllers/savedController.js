const SavedCollege = require('../models/SavedCollege');
const SavedComparison = require('../models/SavedComparison');
const College = require('../models/College');

// GET /api/saved — get user's saved colleges
exports.getSavedColleges = async (req, res) => {
  try {
    const saved = await SavedCollege.find({ userId: req.user.id }).populate(
      'collegeId',
      'name location city state fees rating logo image ranking type placement cutoffs'
    );
    const colleges = saved
      .filter((s) => s.collegeId) // Safety check: skip if college was deleted
      .map((s) => ({ savedId: s._id, ...s.collegeId.toObject() }));
    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/saved — save a college
exports.saveCollege = async (req, res) => {
  try {
    const { collegeId } = req.body;
    if (!collegeId) return res.status(400).json({ success: false, message: 'collegeId is required.' });

    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });

    const existing = await SavedCollege.findOne({ userId: req.user.id, collegeId });
    if (existing) return res.status(409).json({ success: false, message: 'College already saved.' });

    const saved = await SavedCollege.create({ userId: req.user.id, collegeId });
    res.status(201).json({ success: true, message: 'College saved.', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// DELETE /api/saved/:collegeId — unsave a college
exports.unsaveCollege = async (req, res) => {
  try {
    const result = await SavedCollege.findOneAndDelete({
      userId: req.user.id,
      collegeId: req.params.collegeId,
    });
    if (!result) return res.status(404).json({ success: false, message: 'Saved college not found.' });
    res.json({ success: true, message: 'College removed from saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/saved/comparisons — get user's saved comparisons
exports.getSavedComparisons = async (req, res) => {
  try {
    const comparisons = await SavedComparison.find({ userId: req.user.id })
      .populate('colleges', 'name logo city state fees rating ranking type');
    res.json({ success: true, data: comparisons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/saved/comparisons — save a comparison
exports.saveComparison = async (req, res) => {
  try {
    const { collegeIds, name } = req.body;
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({ success: false, message: 'Provide at least 2 college IDs to compare.' });
    }

    const saved = await SavedComparison.create({
      userId: req.user.id,
      colleges: collegeIds,
      name: name || 'Saved Comparison'
    });
    
    // Populate to return the full colleges for immediate UI update
    const populated = await SavedComparison.findById(saved._id).populate('colleges', 'name logo city state fees rating ranking type');
    
    res.status(201).json({ success: true, message: 'Comparison saved.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// DELETE /api/saved/comparisons/:id — remove a saved comparison
exports.deleteComparison = async (req, res) => {
  try {
    const result = await SavedComparison.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!result) return res.status(404).json({ success: false, message: 'Saved comparison not found.' });
    res.json({ success: true, message: 'Comparison removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};
