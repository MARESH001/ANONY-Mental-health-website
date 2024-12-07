const express = require('express');
const { createPost, getPosts, getPost, addComment, updateLikes,getComments, getVoteStatus } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPost); // Create a post
router.get('/', authMiddleware, getPosts); // Get all posts
router.get('/:id', authMiddleware, getPost); // Get a single post
router.post('/:id/comments', authMiddleware, addComment); // Add a comment
router.get('/:id/comments', authMiddleware, getComments); // Get comments for a post
router.post('/:id/likes', authMiddleware, updateLikes); // Update likes/dislikes
router.get('/:id/vote-status', authMiddleware, getVoteStatus); // Update likes/dislikes




module.exports = router;
