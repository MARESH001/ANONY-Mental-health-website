import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const CommentBox = ({ postId, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await onAddComment(postId, comment);
      setComment('');
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Add a Comment"
          fullWidth
          multiline
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CommentBox;
