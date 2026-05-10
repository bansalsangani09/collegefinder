const express = require('express');
const router = express.Router();
const College = require('../models/College');
const validate = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');
const { collegeQuerySchema } = require('../validations/collegeValidation');

// GET /api/colleges?search=&location=&course=&minFees=&maxFees=&page=&limit=
router.get('/', validate(collegeQuerySchema, 'query'), async (req, res) => {

  try {
    const { search, location, state, city, course, minFees, maxFees, page = 1, limit = 9 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.state = { $regex: location, $options: 'i' };
    }

    if (state) {
      query.state = state;
    }

    if (city) {
      query.city = city;
    }

    if (course) {
      query['courses.name'] = course;
    }

    if (minFees || maxFees) {
      query['fees.min'] = {};
      if (minFees) query['fees.min'].$gte = Number(minFees);
      if (maxFees) query['fees.max'] = { $lte: Number(maxFees) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await College.countDocuments(query);
    const colleges = await College.find(query)
      .select('name location city state type fees rating logo image ranking tags placement.placementRate cutoffs')
      .skip(skip)
      .limit(Number(limit))
      .sort({ ranking: 1 });

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: colleges,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/colleges/compare?ids=id1,id2,id3
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ success: false, message: 'Provide college IDs to compare.' });

    const idArray = ids.split(',').map((id) => id.trim()).slice(0, 3);
    const colleges = await College.find({ _id: { $in: idArray } }).select(
      'name location fees rating courses placement type ranking'
    );

    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/colleges/filters - Get dynamic filter values from DB
router.get('/filters', async (req, res) => {
  try {
    const { state } = req.query;
    
    // Fetch distinct states and courses (always needed)
    const [states, courses] = await Promise.all([
      College.distinct('state'),
      College.distinct('courses.name')
    ]);

    // Fetch cities, optionally filtered by state
    const cityQuery = state ? { state } : {};
    const cities = await College.distinct('city', cityQuery);

    res.json({
      success: true,
      states: states.sort(),
      cities: cities.sort(),
      courses: courses.sort()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch filters.', error: err.message });
  }
});

// GET /api/colleges/predict?exam=JEE&rank=5000
router.get('/predict', async (req, res) => {
  try {
    const { exam, rank } = req.query;
    if (!exam || !rank) {
      return res.status(400).json({ success: false, message: 'Exam and rank are required.' });
    }

    const numRank = Number(rank);
    
    // Find colleges where the user's rank is better (less than or equal to) the cutoff rank
    const query = {
      cutoffs: {
        $elemMatch: {
          exam: { $regex: exam, $options: 'i' },
          rank: { $gte: numRank }
        }
      }
    };

    const colleges = await College.find(query)
      .select('name location city state type fees rating logo image ranking tags placement.placementRate cutoffs')
      .sort({ ranking: 1 })
      .limit(9);

    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/colleges/:id
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });
    res.json({ success: true, data: college });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /api/colleges/:id/reviews
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const college = await College.findById(req.params.id);

    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });

    const newReview = {
      author: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date(),
    };

    college.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = college.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    college.rating = Number((totalRating / college.reviews.length).toFixed(1));

    await college.save();
    res.status(201).json({ success: true, data: college.reviews, averageRating: college.rating });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// DELETE /api/colleges/:id/reviews/:reviewId
router.delete('/:id/reviews/:reviewId', adminAuth, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });

    college.reviews = college.reviews.filter((rev) => rev._id.toString() !== req.params.reviewId);

    // Recalculate average rating
    if (college.reviews.length > 0) {
      const totalRating = college.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      college.rating = Number((totalRating / college.reviews.length).toFixed(1));
    } else {
      college.rating = 0;
    }

    await college.save();
    res.json({ success: true, data: college.reviews, averageRating: college.rating });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});



module.exports = router;
