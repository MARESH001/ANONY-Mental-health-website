const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Both users
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
  