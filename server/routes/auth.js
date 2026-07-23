import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email, password });

    await user.save();

    const token = await user.generateAuthToken();
    console.log('Auth token generated for user:', user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.log('Registration error:', error);
    console.log('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }


    const user = await User.findByCredentials(email, password);
    console.log('User found:', user._id);

    const token = await user.generateAuthToken();
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message
    });

    res.status(400).json({
      message: 'Invalid login credentials',
      error: error.message
    });
  }
});

export default router;
