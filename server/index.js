import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pasteRoutes from './routes/pastes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV !== 'production';

//  MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://memoryUser:Memorymania@memorymania.8sak7sm.mongodb.net/memorymania?retryWrites=true&w=majority&appName=memorymania';

console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Database host: ${mongoose.connection.host}`);
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });

//  CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  "https://memorymaniacomplete.onrender.com",
  "https://memorymania-frontend.onrender.com",
  "https://memorymania.vercel.app"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use(express.json());

//  Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pastes', pasteRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

//  Production static files
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).send({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

//  Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
