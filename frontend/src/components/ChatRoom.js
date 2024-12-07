import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns'; // Date formatting
import { io } from 'socket.io-client';

const ChatRoom = () => {
  const { chatRoomId } = useParams(); // Get the chatRoomId from route
  const [messages, setMessages] = useState([]); // Store messages
  const [newMessage, setNewMessage] = useState(''); // New message input
  const messagesEndRef = useRef(null); // Scroll reference
  const userId = useRef(null); // Store userId persistently
  const socket = useRef(null); // Socket instance

  // Fetch userId from the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userId.current = decodedToken.id;
      console.log('User ID:', userId.current);
    } else {
      console.error('No token found. User is not authenticated.');
    }
  }, []);

  // Initialize socket and join chat room
  useEffect(() => {
    socket.current = io('http://localhost:5001');
    if (chatRoomId && userId.current) {
      socket.current.emit('join-room', { chatRoomId, userId: userId.current });
    }

    socket.current.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.current.disconnect(); // Cleanup on unmount
    };
  }, [chatRoomId]);

  // Fetch existing messages
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
    }
  }, [chatRoomId]);

  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/chat-messages/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        scrollToBottom(); // Scroll to the latest message
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        chatRoomId,
        content: newMessage,
        senderId: userId.current,
      };
      socket.current.emit('send-message', message);
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'hh:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Chat Room
      </Typography>
      <Paper elevation={3} sx={{ height: 400, overflowY: 'scroll', padding: 2, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ marginBottom: 2, textAlign: msg.sender._id === userId.current ? 'right' : 'left' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', marginBottom: 0.5 }}>
              {msg.sender._id === userId.current ? 'You' : msg.sender.username || 'User'}
              <span style={{ marginLeft: 10, fontSize: 10 }}>{formatTimestamp(msg.createdAt)}</span>
            </Typography>
            <Typography
              sx={{
                display: 'inline-block',
                padding: 1.5,
                borderRadius: 3,
                maxWidth: '70%',
                backgroundColor: msg.sender._id === userId.current ? '#e0f7fa' : '#f0f4c3',
                color: msg.sender._id === userId.current ? '#00796b' : '#827717',
                wordBreak: 'break-word',
                fontSize: '0.95rem',
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Divider />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          sx={{ flex: 1 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} sx={{ flexShrink: 0 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
