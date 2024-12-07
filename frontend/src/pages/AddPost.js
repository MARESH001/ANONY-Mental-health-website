import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Container, TextField, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('students');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagList = tags.split(',').map((tag) => tag.trim());
    await api.post('/posts', { title, content, tags: tagList, visibility });
    navigate('/');
  };

  return (
    <Container sx={{ marginTop: 4, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Create Post
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '400px', // Ensures the form fills vertical space
        }}
      >
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Content"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <TextField
          label="Tags (comma-separated)"
          fullWidth
          margin="normal"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <FormControl component="fieldset" sx={{ marginTop: 2 }}>
          <Typography>Who can view this post?</Typography>
          <RadioGroup
            row
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <FormControlLabel value="students" control={<Radio />} label="Students" />
            <FormControlLabel value="psychologists" control={<Radio />} label="Psychologists" />
            <FormControlLabel value="both" control={<Radio />} label="Both" />
          </RadioGroup>
        </FormControl>
        <Box sx={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Submit Post
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddPost;
