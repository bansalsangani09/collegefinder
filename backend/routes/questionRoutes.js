const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const questionController = require('../controllers/questionController');

// GET /api/questions
router.get('/', questionController.getQuestions);

// POST /api/questions
router.post('/', auth, questionController.createQuestion);

// POST /api/questions/:id/answers
router.post('/:id/answers', auth, questionController.createAnswer);

// PUT /api/questions/:id
router.put('/:id', auth, questionController.updateQuestion);

// DELETE /api/questions/:id
router.delete('/:id', auth, questionController.deleteQuestion);

module.exports = router;
