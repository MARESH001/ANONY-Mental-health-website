import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUsername(decodedToken.username);

      const fetchNotifications = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/notifications', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setNotifications(response.data);
          }
        } catch (err) {
          console.error('Error fetching notifications:', err.message);
        }
      };

      fetchNotifications();
    }
  }, [token]);

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const checkRoomAndNavigate = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/chat-requests/my-room', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data.chatRoomId) {
        navigate(`/chat-room/${response.data.chatRoomId}`);
      } else {
        alert('No chat room available for you.');
      }
    } catch (err) {
      console.error('Error checking chat room:', err.message);
      alert('Failed to check chat room. Please try again.');
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const mobileMenu = (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        {token ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
                <ListItemText primary="Notifications" sx={{ marginLeft: 2 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/add-post">
                <ListItemText primary="Create Post" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={checkRoomAndNavigate}>
                <ListItemText primary="Join My Chat Room" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/register">
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'primary.main',
        paddingX: { xs: 2, sm: 4 },
        paddingY: { xs: 1, sm: 2 },
        boxShadow: 3,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#FFFFFF',
            textDecoration: 'none',
            flexGrow: 1,
            marginLeft: isMobile ? 0 : 2,
          }}
          component={Link}
          to="/"
        >
          ANONY
        </Typography>

        {username && !isMobile && (
          <Typography
            variant="body2"
            sx={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              marginRight: 'auto',
              marginLeft: 2,
            }}
          >
            Hello, {username}!
          </Typography>
        )}

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            {mobileMenu}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {token ? (
              <>
                <IconButton color="inherit" onClick={handleNotificationClick}>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/add-post"
                  sx={{ paddingX: 3, paddingY: 1 }}
                >
                  Create Post
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={checkRoomAndNavigate}
                  sx={{ paddingX: 3, paddingY: 1 }}
                >
                  Join My Chat Room
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ paddingX: 3, paddingY: 1 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ paddingX: 3 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/register"
                  sx={{ paddingX: 3 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
