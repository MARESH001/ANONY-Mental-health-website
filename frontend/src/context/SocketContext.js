// src/context/SocketContext.js
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to extract user ID
      const userId = decodedToken.id;

      const newSocket = io('http://localhost:5001', {
        query: { userId }, // Pass userId when connecting
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log(`Connected with socket ID: ${newSocket.id}`);
      });

      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
