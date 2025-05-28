import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'memorymania_secret_key_2024';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate.' });
  }
};

export default auth;