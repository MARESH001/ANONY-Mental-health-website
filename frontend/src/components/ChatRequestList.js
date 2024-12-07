import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ChatRequestList = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/chat/requests');
        setRequests(data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();
  }, []);

  const handleRequest = async (requestId, action, reason = '') => {
    try {
      const { data } = await api.post('/chat/respond', { requestId, action, reason });
      if (action === 'accept') {
        navigate(`/chat-room/${data.chatRoom._id}`);
      } else {
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
      }
    } catch (err) {
      console.error('Error responding to request:', err);
    }
  };

  return (
    <div>
      <h2>Chat Requests</h2>
      {requests.map((request) => (
        <div key={request._id}>
          <p>
            Chat request from {request.seeker.username} for Post: {request.postId.title}
          </p>
          <button onClick={() => handleRequest(request._id, 'accept')}>Accept</button>
          <button onClick={() => handleRequest(request._id, 'reject', 'Not interested')}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatRequestList;
