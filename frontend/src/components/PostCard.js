import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import axios from 'axios';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasVoted, setHasVoted] = useState(false); // Tracks if the user has voted
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false); // For chat request loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user has already voted
        const voteResponse = await axios.get(
          `http://localhost:5001/api/posts/${post._id}/vote-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setHasVoted(voteResponse.data.hasVoted);

        // Fetch comments
        const commentsResponse = await axios.get(
          `http://localhost:5001/api/posts/${post._id}/comments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setComments(commentsResponse.data.comments);
      } catch (err) {
        console.error('Failed to fetch data:', err.response?.data?.error || err.message);
      }
    };

    fetchData();
  }, [post._id]);

  // Handle voting action (upvote or downvote)
  const handleVote = async (action) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5001/api/posts/${post._id}/likes`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setLikes(data.likes); // Update likes dynamically
      setHasVoted(true); // Disable voting buttons
    } catch (err) {
      console.error('Failed to update vote:', err.response?.data?.error || err.message);
    }
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        const { data } = await axios.post(
          `http://localhost:5001/api/posts/${post._id}/comments`,
          { content: comment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setComments((prev) => [...prev, data]); // Add the new comment to the state
        setComment(''); // Clear the comment input
      } catch (err) {
        console.error('Failed to add comment:', err.response?.data?.error || err.message);
      }
    }
  };

  // Handle sending a chat request
  const handleChatRequest = async (commenterId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/chat-requests/request`,
        { commenterId, postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Chat request sent successfully!');
    } catch (err) {
      console.error('Failed to send chat request:', err.response?.data?.error || err.message);
      alert('Failed to send chat request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ display: 'flex', marginBottom: 3, borderRadius: 4, boxShadow: 2, overflow: 'hidden' }}>
      {/* Voting Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F7F7',
          padding: 2,
        }}
      >
        <IconButton
          onClick={() => handleVote('upvote')}
          color="primary"
          size="large"
          disabled={hasVoted} // Disable button after voting
        >
          <ArrowDropUp />
        </IconButton>
        <Typography variant="h6" color="textSecondary">
          {likes}
        </Typography>
        <IconButton
          onClick={() => handleVote('downvote')}
          color="secondary"
          size="large"
          disabled={hasVoted} // Disable button after voting
        >
          <ArrowDropDown />
        </IconButton>
      </Box>

      {/* Post Content Section */}
      <Box sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color: '#6C63FF' }}>
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
            Posted by: {post.author.username}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {post.content}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
            {post.tags.map((tag, index) => (
              <Chip key={index} label={`#${tag}`} size="small" sx={{ backgroundColor: '#6C63FF', color: '#FFFFFF' }} />
            ))}
          </Stack>
          <Button component={Link} to={`/post/${post._id}`} variant="contained" color="primary" size="small">
            View Full Discussion
          </Button>
        </CardContent>

        <Divider />

        {/* Comments Section */}
        <Box sx={{ padding: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
            Comments:
          </Typography>
          <Box>
            {comments.map((comment) => (
              <Box
                key={comment._id}
                sx={{
                  marginBottom: 1,
                  padding: 1,
                  backgroundColor: '#F9F9FF',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {comment.author?.username || 'Unknown User'}
                </Typography>
                <Typography variant="body2">{comment.content}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  disabled={loading}
                  onClick={() => handleChatRequest(comment.author?._id)} // Pass the author's ID
                  sx={{ marginTop: 1 }}
                >
                  Request Chat
                </Button>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleAddComment} variant="contained" color="primary" sx={{ marginLeft: 1 }}>
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
