import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import AnswerCard from '../components/AnswerCard';
import { Container, Typography } from '@mui/material';

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      const { data } = await api.get(`/questions/${id}`);
      setQuestion(data);
      setAnswers(data.answers);
    };
    fetchQuestionDetails();
  }, [id]);

  return (
    <Container sx={{ marginTop: 4 }}>
      {question && (
        <>
          <Typography variant="h4" color="primary" gutterBottom>
            {question.content}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            By: {question.author.name}
          </Typography>
          <div style={{ marginTop: 16 }}>
            {answers.map((answer) => (
              <AnswerCard key={answer._id} answer={answer} />
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default QuestionDetails;
