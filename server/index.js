import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pasteRoutes from './routes/pastes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memorymania';
console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Database host: ${mongoose.connection.host}`);
    console.log(`Database port: ${mongoose.connection.port}`);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pastes', pasteRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


if (process.env.NODE_ENV === 'production') {

  const clientBuildPath = path.join(__dirname, '../dist');
  app.use(express.static(clientBuildPath));

  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).send({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
