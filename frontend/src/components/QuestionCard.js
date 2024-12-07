import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';

const QuestionCard = ({ question }) => {
  return (
    <Card sx={{ marginBottom: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          {question.content}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          By: {question.author.name}
        </Typography>
        <div style={{ marginTop: 8 }}>
          {question.tags.map((tag, index) => (
            <Chip key={index} label={`#${tag}`} style={{ marginRight: 4 }} />
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button component={Link} to={`/question/${question._id}`} variant="outlined" size="small">
            View Details
          </Button>
          <div>
            <Button size="small" color="success" variant="text">👍 {question.likes}</Button>
            <Button size="small" color="error" variant="text">👎 {question.dislikes}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
