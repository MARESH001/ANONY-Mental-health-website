import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/posts');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography
        variant="h4"
        color="black"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Explore Posts
      </Typography>
      <Box>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </Box>
    </Container>
  );
};

export default Home;
