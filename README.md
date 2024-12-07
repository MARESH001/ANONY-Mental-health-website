# ANONY-Mental-health-website


## Introduction

This is a full-stack application built with React (frontend) and Node.js/Express (backend), designed to manage posts, questions, and a chat system. The app includes real-time messaging, voting, commenting, and user authentication.

---

## Features

### Backend
- **User Authentication**: Registration and login with JWT-based authentication.
- **Post Management**:
  - Create, fetch, and interact with posts (likes, comments).
  - Real-time chat request system for post commenters.
- **Question Management**: Create and fetch questions with voting functionality.
- **Notifications**: Fetch and manage notifications.
- **Real-Time Chat**: Chat rooms for private communication, integrated with Socket.IO.

### Frontend
- **Responsive UI**: Built using Material-UI for a modern, clean interface.
- **Dynamic Content**: Fetch and display posts, questions, and notifications dynamically.
- **Real-Time Updates**: Integrated real-time chat functionality.
- **Interactive Elements**:
  - Voting system for posts and questions.
  - Commenting system for posts.
  - Chat request system for direct interaction.

---

## Technologies Used

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Web framework for API development.
- **MongoDB**: Database for managing users, posts, questions, and chats.
- **Socket.IO**: Real-time messaging functionality.
- **JWT**: Secure user authentication.

### Frontend
- **React**: UI development.
- **Material-UI**: Component library for consistent styling.
- **Axios**: API communication.
- **React Router**: Navigation between pages.

---

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- MongoDB database connection (local or cloud).

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_PERSPECTIVE_API_KEY=<your-google-api-key>
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user and retrieve JWT.

### Posts
- `POST /api/posts`: Create a new post.
- `GET /api/posts`: Fetch all posts.
- `POST /api/posts/:id/comments`: Add a comment to a post.
- `POST /api/posts/:id/likes`: Vote on a post.

### Questions
- `POST /api/questions`: Create a new question.
- `GET /api/questions`: Fetch all questions.

### Chat
- `POST /api/chat-requests/request`: Send a chat request.
- `GET /api/chat-requests/requests`: Fetch chat requests.

---

## Folder Structure

### Backend
```
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── server.js
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── App.js
│   ├── index.js
```

---

## Future Enhancements
- Add pagination for posts and questions.
- Implement user profile pages.
- Integrate search functionality for posts and questions.
- Enhance real-time notifications.

---

## License

This project is licensed under the MIT License.
