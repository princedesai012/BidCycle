const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Protected route - only logged in users can chat
router.post('/', protect, chat);

module.exports = router;
