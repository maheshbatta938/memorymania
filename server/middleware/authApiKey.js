import User from '../models/User.js';

const authApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-KEY') || req.header('x-api-key');
    if (!apiKey) {
      throw new Error('API key is missing.');
    }

    const user = await User.findOne({ 'apiKeys.key': apiKey });
    if (!user) {
      throw new Error('Invalid API key.');
    }

    req.user = user;
    req.apiKey = apiKey;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message || 'Please authenticate with a valid API key.' });
  }
};

export default authApiKey;
