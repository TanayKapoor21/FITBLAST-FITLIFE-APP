const asyncHandler = require('express-async-handler');

// @desc    Handle chat messages and return AI response
// @route   POST /api/chat
// @access  Public
const chatHandler = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // For now, return a simple mock response
  // In future, integrate with AI model or API here
  let reply = "Sorry, I am still learning and cannot answer that yet.";

  // Simple keyword-based mock responses
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    reply = "Hello! How can I assist you with your fitness goals today?";
  } else if (lowerMsg.includes('workout')) {
    reply = "I recommend a balanced workout routine including cardio, strength training, and flexibility exercises.";
  } else if (lowerMsg.includes('diet') || lowerMsg.includes('nutrition')) {
    reply = "A healthy diet includes a balance of proteins, carbs, fats, and plenty of water.";
  } else if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
    reply = "You're welcome! Feel free to ask me anything else.";
  }

  res.json({ reply });
});

module.exports = {
  chatHandler,
};
