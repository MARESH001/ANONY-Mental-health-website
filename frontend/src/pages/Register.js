import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { maleAnimeData, femaleAnimeData, randomAnimeData } from '../data/animeData'; // Data with images and names

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [usernameType, setUsernameType] = useState('male');
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [animeList, setAnimeList] = useState(maleAnimeData); // Default anime list

  const navigate = useNavigate();

  // Change anime list based on username type
  const handleUsernameTypeChange = (type) => {
    setUsernameType(type);
    setAnimeList(
      type === 'male' ? maleAnimeData : type === 'female' ? femaleAnimeData : randomAnimeData
    );
  };

  const spinWheel = () => {
    setSpinning(true);
    const interval = setInterval(() => {
      const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];
      setSelectedImage(randomAnime.image);
    }, 100); // Change image every 100ms

    setTimeout(() => {
      clearInterval(interval);
      const selectedAnime = animeList[Math.floor(Math.random() * animeList.length)];
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const newUsername = `${selectedAnime.name}${randomNumber}`;
      setGeneratedUsername(newUsername);
      checkUsernameAvailability(newUsername);
      setSelectedImage(selectedAnime.image);
      setSpinning(false);
    }, 3000); // Stop spinning after 3 seconds
  };

  const checkUsernameAvailability = async (username) => {
    try {
      await api.get(`/auth/check-username/${username}`);
      setUsernameError(''); // Username is available
    } catch (err) {
      setUsernameError('Username is already taken. Please spin again!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = generatedUsername;
    if (!username) return; // Ensure a username is generated
    try {
      await api.post('/auth/register', { email, password, username, role });
      toast.success('Registration successful!');

      navigate('/login'); // Redirect to login
    } catch (err) {
     
      toast.error('Username is already taken. Please spin again!');

      console.error(err.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <Container
      sx={{
        marginTop: 4,
        maxWidth: { xs: '100%', sm: 600 },
        padding: { xs: 2, sm: 4 },
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        sx={{ marginBottom: 4, textAlign: 'center', fontWeight: 'bold' }}
      >
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ borderRadius: 1, boxShadow: 1 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ borderRadius: 1, boxShadow: 1 }}
        />
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
            sx={{ boxShadow: 1, borderRadius: 1 }}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="psychologist">Psychologist</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" sx={{ marginTop: 3, width: '100%' }}>
          <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            Select Username Type:
          </Typography>
          <RadioGroup
            row
            value={usernameType}
            onChange={(e) => handleUsernameTypeChange(e.target.value)}
            sx={{ justifyContent: 'center' }}
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Male Anime Character"
              sx={{ marginRight: 2 }}
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female Anime Character"
              sx={{ marginRight: 2 }}
            />
            <FormControlLabel value="random" control={<Radio />} label="Random Anime Character" />
          </RadioGroup>
        </FormControl>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Anime Character"
              sx={{
                width: { xs: 120, sm: 150 },
                height: { xs: 120, sm: 150 },
                borderRadius: '50%',
                boxShadow: 2,
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={spinWheel}
            disabled={spinning}
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              alignSelf: 'center',
            }}
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </Button>
          <Typography
            variant="h6"
            color={usernameError ? 'error' : 'secondary'}
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '1rem',
              padding: 1,
            }}
          >
            {usernameError || generatedUsername}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{
            marginTop: 4,
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: { xs: 1, sm: 2 },
            textTransform: 'none',
            alignSelf: 'center',
            width: '50%',
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
