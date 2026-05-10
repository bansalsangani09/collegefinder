const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const collegeRoutes = require('./collegeRoutes');
const savedRoutes = require('./savedRoutes');
const adminRoutes = require('./adminRoutes');
const questionRoutes = require('./questionRoutes');

router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/saved', savedRoutes);
router.use('/admin', adminRoutes);
router.use('/questions', questionRoutes);

module.exports = router;
