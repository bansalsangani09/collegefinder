const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const savedController = require('../controllers/savedController');

// GET /api/saved — get user's saved colleges
router.get('/', auth, savedController.getSavedColleges);

// POST /api/saved — save a college
router.post('/', auth, savedController.saveCollege);

// DELETE /api/saved/:collegeId — unsave a college
router.delete('/:collegeId', auth, savedController.unsaveCollege);

// GET /api/saved/comparisons — get user's saved comparisons
router.get('/comparisons', auth, savedController.getSavedComparisons);

// POST /api/saved/comparisons — save a comparison
router.post('/comparisons', auth, savedController.saveComparison);

// DELETE /api/saved/comparisons/:id — remove a saved comparison
router.delete('/comparisons/:id', auth, savedController.deleteComparison);

module.exports = router;
