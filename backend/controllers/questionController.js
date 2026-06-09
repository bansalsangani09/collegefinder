const Question = require('../models/Question');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// GET /api/questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/questions
exports.createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description required.' });
    }

    const question = await Question.create({
      title,
      description,
      authorName: req.user.name,
      authorId: req.user.id,
    });

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `Please provide a concise and helpful answer (around 50 words) to the following question about colleges:\nTitle: ${title}\nDescription: ${description}`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      if (aiResponse) {
        question.answers.push({
          text: aiResponse,
          authorName: 'Gemini AI',
          date: new Date()
        });
        await question.save();
      }
    } catch (aiError) {
      console.error('Error generating AI answer:', aiError);
    }

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/questions/:id/answers
exports.createAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Answer text required.' });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    const newAnswer = {
      text,
      authorName: req.user.name,
      authorId: req.user.id,
      date: new Date()
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const isOwner = question.authorId && question.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this question.' });
    }

    if (title) question.title = title;
    if (description) question.description = description;

    // Regenerate AI Answer for the updated question
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `Please provide an updated concise and helpful answer (around 50 words) to the following updated question about colleges:\nTitle: ${question.title}\nDescription: ${question.description}`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      if (aiResponse) {
        // Find existing Gemini answer to update it, or add new if not found
        const aiAnswerIndex = question.answers.findIndex(ans => ans.authorName === 'Gemini AI');
        if (aiAnswerIndex !== -1) {
          question.answers[aiAnswerIndex].text = aiResponse;
          question.answers[aiAnswerIndex].date = new Date();
        } else {
          question.answers.push({
            text: aiResponse,
            authorName: 'Gemini AI',
            date: new Date()
          });
        }
      }
    } catch (aiError) {
      console.error('Error regenerating AI answer on update:', aiError);
    }

    await question.save();

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const isOwner = question.authorId && question.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this question.' });
    }

    await question.deleteOne();

    res.json({ success: true, message: 'Question removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};
