const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom", // Reference the ChatRoom model
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
