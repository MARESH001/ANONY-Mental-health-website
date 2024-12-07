const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    // Check if email or username is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken. Please choose another.' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security
    const user = await User.create({ email, password: hashedPassword, username, role });

    // Include email in the JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username }, // Include username
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Include email in the JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username }, // Include username
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }
    res.status(200).json({ message: 'Username is available.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

