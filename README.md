# MemoryMania

A full-stack MERN application for creating and managing text snippets and code pastes.

## Features

- User Authentication (Register/Login)
- Create, Read, Update, Delete (CRUD) operations for pastes
- Syntax highlighting for code snippets
- Responsive design
- Search functionality
- Tag-based organization

## Live Demo

Frontend: [Your frontend URL when deployed]
Backend: https://memorymania-kc51.onrender.com

## Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Register Page
![Register Page](./screenshots/register.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Create Paste
![Create Paste](./screenshots/create-paste.png)

### Edit Paste
![Edit Paste](./screenshots/edit-paste.png)

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- TailwindCSS
- JWT Authentication

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Create a .env file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development servers:
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend
   npm run server
   ```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/pastes` - Get all pastes
- `POST /api/pastes` - Create new paste
- `PUT /api/pastes/:id` - Update paste
- `DELETE /api/pastes/:id` - Delete paste
- `GET /api/pastes/search` - Search pastes

## Created By
Mahesh Batta
