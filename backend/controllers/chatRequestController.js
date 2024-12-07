const ChatRequest = require('../models/ChatRequest');
const ChatRoom = require('../models/ChatRoom');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User'); // Ensure the User model is imported

// Get chat requests for a user
exports.getChatRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch chat requests where the user is the commenter
    const requests = await ChatRequest.find({ commenter: userId })
      .populate('seeker', 'username') // Populate seeker username
      .populate('postId', 'title') // Populate post title
      .sort({ createdAt: -1 }); // Sort by most recent

    // Transform the requests to include only necessary data
    const transformedRequests = requests.map((req) => ({
      _id: req._id,
      seekerName: req.seeker.username,
      postTitle: req.postId.title,
    }));

    res.status(200).json(transformedRequests);
  } catch (error) {
    console.error('Error fetching chat requests:', error.message);
    res.status(500).json({ error: 'Failed to fetch chat requests. Please try again.' });
  }
};

// Send a chat request
exports.sendChatRequest = async (req, res) => {
  try {
    const { commenterId, postId } = req.body;

    if (!commenterId || !postId) {
      return res.status(400).json({ error: 'Commenter ID and Post ID are required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Find the commenter by their user ID
    const commenter = await User.findById(commenterId).select('_id username');
    if (!commenter) {
      return res.status(404).json({ error: 'Commenter not found.' });
    }

    // Check for existing pending chat requests
    const existingRequest = await ChatRequest.findOne({
      seeker: req.user.id,
      commenter: commenter._id,
      postId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent.' });
    }

    // Create the chat request
    const chatRequest = await ChatRequest.create({
      seeker: req.user.id,
      commenter: commenter._id, // Use the ObjectId of the commenter
      postId,
    });

    // Get the seeker's username
    const seeker = await User.findById(req.user.id).select('username');

    // Send the chat request notification to the recipient
    req.io.to(commenter._id.toString()).emit('chat-request', {
      chatRequestId: chatRequest._id,
      seekerName: seeker.username, // Include seeker's username
      postTitle: post.title, // Include post title
    });

    res.status(201).json(chatRequest);
  } catch (error) {
    console.error('Error sending chat request:', error.message);
    res.status(500).json({ error: 'Failed to send chat request. Please try again.' });
  }
};

// Respond to a chat request
exports.respondChatRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const chatRequest = await ChatRequest.findById(requestId);
    if (!chatRequest) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    if (chatRequest.commenter.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to respond to this request.' });
    }

    if (action === 'accept') {
      chatRequest.status = 'accepted';

      // Find or create the chat room
      let chatRoom = await ChatRoom.findOne({
        participants: { $all: [chatRequest.seeker, chatRequest.commenter] },
        postId: chatRequest.postId,
      });

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          participants: [chatRequest.seeker, chatRequest.commenter],
          postId: chatRequest.postId,
        });
      }

      // Notify both participants about the chat room
      req.io.to(chatRequest.seeker.toString()).emit('chat-accepted', {
        chatRoomId: chatRoom._id,
        postId: chatRequest.postId,
      });

      req.io.to(chatRequest.commenter.toString()).emit('chat-accepted', {
        chatRoomId: chatRoom._id,
        postId: chatRequest.postId,
      });

      return res.status(200).json({ message: 'Chat accepted', chatRoom });
    } else if (action === 'reject') {
      chatRequest.status = 'rejected';
      await chatRequest.save();
      req.io.to(chatRequest.seeker.toString()).emit('chat-rejected');
    }
  } catch (err) {
    console.error('Error responding to chat request:', err.message);
    res.status(500).json({ error: 'Failed to respond to chat request. Please try again.' });
  }
};

// Fetch Chat Room ID for an Accepted Chat Request
exports.getChatRoomForRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    console.log("Request Id:",requestId)

    // Find the chat request
    const chatRequest = await ChatRequest.findById(requestId);
    if (!chatRequest) {
      return res.status(404).json({ error: 'Chat request not found.' });
    }

    // Ensure the requester is either the seeker or the commenter
    if (
      chatRequest.seeker.toString() !== req.user.id.toString() &&
      chatRequest.commenter.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized to view this chat room.' });
    }

    

    // Find the chat room for the given participants and post
    const chatRoom = await ChatRoom.findOne({
      participants: { $all: [chatRequest.seeker, chatRequest.commenter] },
      postId: chatRequest.postId,
    });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found.' });
    }

    res.status(200).json({ chatRoomId: chatRoom._id });
  } catch (err) {
    console.error('Error fetching chat room ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch chat room ID. Please try again.' });
  }
};


// Route: GET /api/chat-requests/my-room
exports.getMyRoom = async (req, res) => {
  try {
    const userId = req.user.id;

    const room = await ChatRoom.findOne({
      participants: userId,
    });

    if (room) {
      return res.status(200).json({ chatRoomId: room._id });
    }

    return res.status(404).json({ message: 'No chat room found for this user.' });
  } catch (err) {
    console.error('Error finding chat room:', err.message);
    res.status(500).json({ error: 'Failed to retrieve chat room. Please try again.' });
  }
};



