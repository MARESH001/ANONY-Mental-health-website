const mongoose = require('mongoose');

const chatRequestSchema = new mongoose.Schema({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
  reason: { type: String },
});

module.exports = mongoose.model('ChatRequest', chatRequestSchema);
