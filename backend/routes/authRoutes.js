const express = require('express');
const { register, login, checkUsername } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username/:username', checkUsername);

module.exports = router;
