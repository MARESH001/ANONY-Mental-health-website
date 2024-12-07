import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { SocketProvider } from './context/SocketContext';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF', // Light violet
    },
    secondary: {
      main: '#FF914D', // Orange
    },
    background: {
      default: '#F9F9FF', // Light background
    },
    text: {
      primary: '#333333',
      secondary: '#6C63FF',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    },
  },
});

// Create the root element and render the app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root using createRoot API

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    
    <App />
  </ThemeProvider>
);
