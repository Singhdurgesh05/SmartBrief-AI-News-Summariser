const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/authcontroller');
const auth = require('../middleware/authmiddleware');

// @route   POST api/auth/register
// @desc    Register new user
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

// @route   GET api/auth/user
// @desc    Get user data
router.get('/user', auth, getUser);

module.exports = router;