const Question = require('../models/Question');
const axios = require('axios');

// Function to validate content using Google Perspective API
const validateContent = async (content) => {
  const response = await axios.post(
    'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
    {
      comment: { text: content },
      languages: ['en'],
      requestedAttributes: { TOXICITY: {} },
    },
    { params: { key: process.env.GOOGLE_PERSPECTIVE_API_KEY } }
  );
  const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
  return toxicityScore < 0.7; // Allow posts with toxicity score < 0.7
};

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { content, tags } = req.body;

    // Validate question content
    const isValid = await validateContent(content);
    if (!isValid) {
      return res.status(400).json({ error: 'Your content violates community standards.' });
    }

    const question = await Question.create({
      content,
      tags,
      author: req.user.id, // Author is derived from JWT
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('author', 'name'); // Populate author name
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
