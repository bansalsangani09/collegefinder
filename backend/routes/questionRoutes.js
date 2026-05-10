const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const generateAIAnswer = async (prompt) => {
  console.log('--- Gemini AI Request Start ---');
  const apiUrl = process.env.GEMINI_API_URL;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('Missing configuration: URL or API Key is undefined.');
    console.log('URL:', apiUrl);
    console.log('API Key Present:', !!apiKey);
    return null;
  }

  try {
    console.log('Using URL:', apiUrl);
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    console.log('Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error Response:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    
    if (aiResponse) {
      console.log('AI Response successfully generated.');
    } else {
      console.warn('AI Response was empty or candidates missing.');
      console.log('Raw Data:', JSON.stringify(data, null, 2));
    }

    console.log('--- Gemini AI Request End ---');
    return aiResponse;
  } catch (error) {
    console.error('Gemini REST API Fatal Error:', error.message);
    console.log('--- Gemini AI Request End (Failed) ---');
    return null;
  }
};

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /api/questions
router.post('/', auth, async (req, res) => {
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
      const prompt = `Please provide a concise and helpful answer (around 50 words) to the following question about colleges:\nTitle: ${title}\nDescription: ${description}`;
      const aiResponse = await generateAIAnswer(prompt);

      if (aiResponse) {
        question.answers.push({
          text: aiResponse,
          authorName: 'Gemini AI',
          date: new Date()
        });
        await question.save();
        console.log('AI Answer saved to database.');
      }
    } catch (aiError) {
      console.error('Error in AI integration flow:', aiError);
    }

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /api/questions/:id/answers
router.post('/:id/answers', auth, async (req, res) => {
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
});

// PUT /api/questions/:id
router.put('/:id', auth, async (req, res) => {
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
      const prompt = `Please provide an updated concise and helpful answer (around 50 words) to the following updated question about colleges:\nTitle: ${question.title}\nDescription: ${question.description}`;
      const aiResponse = await generateAIAnswer(prompt);

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
        console.log('AI Answer updated in database.');
      }
    } catch (aiError) {
      console.error('Error regenerating AI answer on update flow:', aiError);
    }

    await question.save();

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// DELETE /api/questions/:id
router.delete('/:id', auth, async (req, res) => {
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
});

module.exports = router;
