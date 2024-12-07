import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Badge,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userId = JSON.parse(atob(token.split('.')[1])).id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/chat-requests/requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err.response?.data || err.message);
      }
    };

    fetchNotifications();

    const socket = io('http://localhost:5001', {
      query: { userId },
    });

    socket.on('chat-request', (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/chat-requests/respond',
        { requestId: currentRequest._id, action: 'accept' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch chat room ID
      const chatRoomResponse = await axios.get(
        `http://localhost:5001/api/chat-requests/room/${currentRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { chatRoomId } = chatRoomResponse.data;
      alert('Chat accepted!');
      setNotifications((prev) => prev.filter((req) => req._id !== currentRequest._id));

      // Redirect to the chat room
      window.location.href = `/chat-room/${chatRoomId}`;
    } catch (err) {
      console.error('Failed to accept chat request:', err.response?.data || err.message);
      alert('Failed to accept chat request. Please try again.');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleReject = async (reason) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5001/api/chat-requests/respond',
        { requestId: currentRequest._id, action: 'reject', reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Chat rejected!');
      setNotifications((prev) => prev.filter((req) => req._id !== currentRequest._id));
    } catch (err) {
      console.error('Failed to reject chat request:', err.response?.data || err.message);
      alert('Failed to reject chat request. Please try again.');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5001/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
      alert('Notification deleted successfully!');
    } catch (err) {
      console.error('Failed to delete notification:', err.response?.data || err.message);
      alert('Failed to delete notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllNotifications = async () => {
    setLoading(true);
    try {
      await axios.delete('http://localhost:5001/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications([]);
      alert('All notifications deleted successfully!');
    } catch (err) {
      console.error('Failed to delete all notifications:', err.response?.data || err.message);
      alert('Failed to delete all notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: 2,
        backgroundColor: '#f4f4f9',
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 3,
        }}
      >
        Notifications
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteAllNotifications}
        disabled={loading}
        sx={{
          marginBottom: 2,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Delete All Notifications
      </Button>

      {notifications.length === 0 ? (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.secondary',
      marginTop: 3,
    }}
  >
    <Typography
      sx={{
        fontSize: '1rem',
        marginRight: 1,
      }}
    >
      No notifications yet.
    </Typography>
    <NotificationsActiveIcon sx={{ color: '#f57c00' }} />
  </Box>
) : (
  notifications.map((notification) => (
    <Card
      key={notification._id}
      sx={{
        marginBottom: 2,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#424242' }}>
          Chat request from{' '}
          <span style={{ color: '#1976d2' }}>{notification.seekerName}</span> for Post:{' '}
          <em>{notification.postTitle}</em>
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', paddingX: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentRequest(notification);
            setOpenDialog(true);
          }}
          disabled={loading}
        >
          Respond
        </Button>
        <IconButton
          color="error"
          onClick={() => handleDeleteNotification(notification._id)}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  ))
)}


      {currentRequest && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Respond to Chat Request</DialogTitle>
          <DialogContent>
            <Typography>
              Do you want to accept or reject this chat request from{' '}
              <strong>{currentRequest.seekerName}</strong> for Post:{' '}
              <em>{currentRequest.postTitle}</em>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleAccept}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} />}
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                const reason = prompt('Reason for rejection (optional):');
                handleReject(reason);
              }}
              color="secondary"
              variant="outlined"
              disabled={loading}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Notifications;
