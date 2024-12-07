import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const AnswerCard = ({ answer }) => {
  return (
    <Card sx={{ marginBottom: 2, backgroundColor: '#f9f9f9' }}>
      <CardContent>
        <Typography variant="body1">{answer.content}</Typography>
        <Typography variant="caption" color="textSecondary">
          By: {answer.author.name}
        </Typography>
        <div style={{ marginTop: 16 }}>
          <Button color="success">👍 {answer.likes}</Button>
          <Button color="error">👎 {answer.dislikes}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
