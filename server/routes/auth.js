import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email, password });

    await user.save();

    const token = await user.generateAuthToken();

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
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }


    const user = await User.findByCredentials(email, password);

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

// Get all API keys of user
router.get('/keys', auth, async (req, res) => {
  try {
    res.send(req.user.apiKeys || []);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Generate a new API key
router.post('/keys', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).send({ message: 'API key description/name is required' });
    }

    const key = 'nk_' + crypto.randomBytes(24).toString('hex');
    const newApiKey = {
      name: name.trim(),
      key,
      createdAt: new Date(),
    };

    req.user.apiKeys = (req.user.apiKeys || []).concat(newApiKey);
    await req.user.save();

    res.status(201).send(newApiKey);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Delete/revoke an API key
router.delete('/keys/:id', auth, async (req, res) => {
  try {
    req.user.apiKeys = (req.user.apiKeys || []).filter(
      (k) => k._id.toString() !== req.params.id
    );
    await req.user.save();
    res.send({ message: 'API key revoked successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
