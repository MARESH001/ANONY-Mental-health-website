const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const ChatMessage=require("./models/ChatMessage")
const authRoutes = require('./routes/authRoutes');
const chatRequestRoutes = require('./routes/chatRequestRoutes');
const chatMessageRoutes = require('./routes/chatMessageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Apply CORS middleware for Express
app.use(cors(corsOptions));

// Socket.IO server with CORS
const io = new Server(server, {
  cors: corsOptions,
});

// Middleware to attach io instance globally
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat-requests', chatRequestRoutes); // Chat Requests
app.use('/api/chat-messages', chatMessageRoutes); // Chat Messages
app.use('/api/posts', postRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again later.' });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // User joins a chat room
  socket.on('join-room', ({ chatRoomId, userId }) => {
    socket.join(chatRoomId);
    console.log(`User ${userId} joined room ${chatRoomId}`);
  });

  // Handle message sending
  socket.on('send-message', async ({ chatRoomId, content, senderId }) => {
    try {
      const message = await ChatMessage.create({ chatRoomId, sender: senderId, content });
      const populatedMessage = await message.populate('sender', 'username');

      // Broadcast the message to the room
      io.to(chatRoomId).emit('new-message', populatedMessage);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
