# MemoryMania

A MERN stack application for sharing and managing code snippets.

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

### Local Deployment Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   ```

3. Build the frontend:
   ```bash
   # In the root directory
   npm run build
   ```

4. Set up environment variables:
   Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/memorymania
   JWT_SECRET=your-secret-key-1234
   NODE_ENV=production
   ```

5. Start the server:
   ```bash
   cd server
   npm start
   ```

The application will be available at `http://localhost:5000`

### Production Deployment

For production deployment:

1. Update the `MONGODB_URI` in `.env` to point to your production database
2. Set a strong `JWT_SECRET`
3. Ensure `NODE_ENV=production` is set
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   cd server
   pm2 start index.js --name memorymania
   ```

## Features

- User authentication
- Code snippet sharing
- Syntax highlighting
- Search functionality
- User profiles

## Tech Stack

- Frontend: React + Vite
- Backend: Express.js
- Database: MongoDB
- Authentication: JWT 