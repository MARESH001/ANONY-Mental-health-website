const express = require('express');
const {
  getChatRequests,
  sendChatRequest,
  respondChatRequest,
  getChatRoomForRequest, // New function
  getMyRoom
} = require('../controllers/chatRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Existing routes
router.get('/requests', authMiddleware, getChatRequests);
router.post('/request', authMiddleware, sendChatRequest);
router.post('/respond', authMiddleware, respondChatRequest);

// New route to get chat room ID
router.get('/room/:requestId', authMiddleware, getChatRoomForRequest);
router.get('/my-room', authMiddleware, getMyRoom);



module.exports = router;
