const { Server } = require("socket.io");
const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/Message");

const chatSocketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // User joins a chat room
    socket.on("join-room", async ({ chatRoomId, userId }) => {
      try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
          socket.emit("error", { message: "Chat room not found." });
          return;
        }

        if (!chatRoom.participants.includes(userId)) {
          socket.emit("error", { message: "Not authorized to join this chat room." });
          return;
        }

        socket.join(chatRoomId);
        console.log(`User ${userId} joined chat room ${chatRoomId}`);

        // Send existing messages to the user
        const messages = await ChatMessage.find({ chatRoomId })
          .sort({ createdAt: 1 })
          .populate("sender", "username");
        socket.emit("chat-history", messages);
      } catch (error) {
        console.error("Error joining chat room:", error.message);
      }
    });

    // Handle sending messages
    socket.on("send-message", async ({ chatRoomId, content, senderId }) => {
      try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom || !chatRoom.participants.includes(senderId)) {
          socket.emit("error", { message: "Not authorized to send messages in this chat room." });
          return;
        }

        // Save message to database
        const message = await ChatMessage.create({
          chatRoomId,
          sender: senderId,
          content,
        });

        const populatedMessage = await message.populate("sender", "username");

        // Broadcast the message to all users in the chat room
        io.to(chatRoomId).emit("new-message", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error.message);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = chatSocketHandler;
