import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Attempting to register user:', { name, email });
    
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: {
          name: !name,
          email: !email,
          password: !password
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    console.log('Created user object:', { 
      id: user._id,
      name: user.name,
      email: user.email
    });

    // Save user to database
    await user.save();
    console.log('User saved successfully:', user._id);
    
    // Generate token
    const token = await user.generateAuthToken();
    console.log('Auth token generated for user:', user._id);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: user.toJSON(),
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ 
        message: 'Email and password are required',
        missing: {
          email: !email,
          password: !password
        }
      });
    }
    
    // Find user by credentials
    const user = await User.findByCredentials(email, password);
    console.log('User found:', user._id);
    
    const token = await user.generateAuthToken();
    console.log('Auth token generated for login:', user._id);
    
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;