const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');
const { collegeQuerySchema } = require('../validations/collegeValidation');
const collegeController = require('../controllers/collegeController');

// GET /api/colleges?search=&location=&course=&minFees=&maxFees=&page=&limit=
router.get('/', validate(collegeQuerySchema, 'query'), collegeController.getColleges);

// GET /api/colleges/compare?ids=id1,id2,id3
router.get('/compare', collegeController.compareColleges);

// GET /api/colleges/filters - Get dynamic filter values from DB
router.get('/filters', collegeController.getFilters);

// GET /api/colleges/predict?exam=JEE&rank=5000
router.get('/predict', collegeController.predictColleges);

// GET /api/colleges/:id
router.get('/:id', collegeController.getCollegeById);

// POST /api/colleges/:id/reviews
router.post('/:id/reviews', auth, collegeController.addReview);

// DELETE /api/colleges/:id/reviews/:reviewId
router.delete('/:id/reviews/:reviewId', adminAuth, collegeController.deleteReview);

module.exports = router;
