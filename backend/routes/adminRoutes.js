const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { collegeSchema } = require('../validations/adminValidation');
const adminController = require('../controllers/adminController');

// GET /api/admin/colleges - List all colleges with full data for management
router.get('/colleges', adminAuth, adminController.getAdminColleges);

// POST /api/admin/colleges - Add a new college
router.post('/colleges', adminAuth, validate(collegeSchema), adminController.addAdminCollege);

// PUT /api/admin/colleges/:id - Edit a college
router.put('/colleges/:id', adminAuth, validate(collegeSchema), adminController.updateAdminCollege);

// DELETE /api/admin/colleges/:id - Delete a college
router.delete('/colleges/:id', adminAuth, adminController.deleteAdminCollege);

// GET /api/admin/reviews - Get all reviews across all colleges for moderation
router.get('/reviews', adminAuth, adminController.getAdminReviews);

module.exports = router;
