const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Referencing the User model
      required: true 
    },
    username: { 
      type: String, 
      required: true // Store username explicitly for easy access
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', // Referencing the Post model
      required: true 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Comment', CommentSchema);
