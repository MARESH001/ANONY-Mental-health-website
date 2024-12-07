const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, visibility } = req.body;
    const post = await Post.create({
      title,
      content,
      tags,
      visibility,
      author: req.user.username,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post. Please try again.' });
  }
};

// Get all posts with visibility filtering
exports.getPosts = async (req, res) => {
  try {
    const { role } = req.user;
    const visibilityFilter = role === 'psychologist' ? ['psychologists', 'both'] : ['students', 'both'];
    const posts = await Post.find({ visibility: { $in: visibilityFilter } })
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'username _id',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts. Please try again.' });
  }
};

// Get a single post with its comments
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'username _id',
        },
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post. Please try again.' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      username: user.username,
      post: id,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate('author', 'username _id');

    res.status(201).json({
      _id: populatedComment._id,
      content: populatedComment.content,
      author: {
        _id: populatedComment.author._id,
        username: populatedComment.author.username,
      },
      createdAt: populatedComment.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment. Please try again.' });
  }
};

// Get vote status for a post
exports.getVoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const hasVoted = post.voters.some((voter) => voter.user.equals(userId));
    res.status(200).json({ hasVoted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vote status. Please try again.' });
  }
};

// Update likes for a post
exports.updateLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const existingVote = post.voters.find((voter) => voter.user.toString() === userId);
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this post.' });
    }

    if (action === 'upvote') {
      post.likes += 1;
      post.voters.push({ user: userId, vote: 'upvote' });
    } else if (action === 'downvote') {
      post.likes -= 1;
      post.voters.push({ user: userId, vote: 'downvote' });
    } else {
      return res.status(400).json({ error: 'Invalid action. Use "upvote" or "downvote".' });
    }

    await post.save();
    res.status(200).json({ likes: post.likes, hasVoted: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes. Please try again.' });
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ post: id })
      .populate('author', 'username _id')
      .sort({ createdAt: -1 });

    const transformedComments = comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      author: {
        _id: comment.author._id,
        username: comment.author.username,
      },
      createdAt: comment.createdAt,
    }));

    res.status(200).json({ comments: transformedComments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments. Please try again.' });
  }
};
