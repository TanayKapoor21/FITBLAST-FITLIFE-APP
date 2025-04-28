const express = require('express');
const router = express.Router();
const { chatHandler } = require('../controllers/chatController');

// POST /api/chat
router.post('/', chatHandler);

module.exports = router;
