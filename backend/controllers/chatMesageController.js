const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");

// Send a message in a chat room
exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, content } = req.body;

    // Validate input
    if (!chatRoomId || !content) {
      return res.status(400).json({ error: "Chat room ID and content are required." });
    }

    // Validate chat room existence
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found." });
    }

    // Validate user authorization
    if (!chatRoom.participants.includes(req.user.id)) {
      return res.status(403).json({ error: "You are not authorized to send messages in this chat room." });
    }

    // Create and save the message
    const message = await ChatMessage.create({
      chatRoomId,
      sender: req.user.id,
      content,
    });

    // Respond with the created message
    res.status(201).json({
      id: message._id,
      chatRoomId: message.chatRoomId,
      sender: message.sender,
      content: message.content,
      timestamp: message.createdAt,
    });
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ error: "An error occurred while sending the message." });
  }
};

// Get all messages in a chat room
exports.getMessages = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    // Validate chat room existence
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found." });
    }

    // Validate user authorization
    if (!chatRoom.participants.includes(req.user.id)) {
      return res.status(403).json({ error: "You are not authorized to view messages in this chat room." });
    }

    // Fetch messages for the chat room, sorted by creation time (oldest first)
    const messages = await ChatMessage.find({ chatRoomId })
      .sort({ createdAt: 1 })
      .populate("sender", "username email"); // Optional: Populate sender details

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: "An error occurred while fetching messages." });
  }
};
