# ANONY Backend Application

## Introduction

This is a backend application for a web platform featuring user authentication, chat functionality, notifications, **POST**s, and questions. It includes real-time messaging, robust data management with MongoDB, and JWT-based authentication for secure access.

---

## Features

### 1. Authentication
- User registration and login with hashed passwords using `bcrypt`.
- JWT-based authentication for stateless and secure API access.
- Middleware to protect routes and validate user roles.

### 2. Chat System
- Chat requests: Users can send and respond to chat requests.
- Chat rooms: Dynamically created chat rooms for authorized participants.
- Real-time messaging: Integrated with `Socket.IO` for instant message delivery.

### 3. Notifications
- Fetch, delete, and bulk delete notifications for users.
- Notifications are tied to user actions, such as chat requests and responses.

### 4. **POST**s and Comments
- Create, fetch, and interact with **POST**s (e.g., likes, comments).
- Support for visibility settings (e.g., specific to roles like "psychologists" or "students").
- Nested comments with user and timestamp details.

### 5. Questions
- Create and fetch questions with validation via Google Perspective API to ensure community standards.

---

## Technologies Used

### Backend
- **Node.js** with **Express.js**: Core server framework.
- **MongoDB**: Database for managing users, chat messages, notifications, and **POST**s.
- **Socket.IO**: Real-time communication for chat.
- **JWT**: Authentication and route protection.
- **Google Perspective API**: Content validation for user-generated questions.

### Middleware
- **bcrypt**: Password hashing for security.
- **dotenv**: Environment variable management.
- **Mongoose**: MongoDB ORM for schema definitions and interactions.

---

## Installation

### Prerequisites
- Node.js and npm installed.
- MongoDB server (local or cloud instance).
- `.env` file with the following variables:

  ```
  MONGO_URI=<your-mongodb-uri>
  JWT_SECRET=<your-jwt-secret>
  GOOGLE_PERSPECTIVE_API_KEY=<your-google-api-key>
  ```
## Steps

Clone the repository:

```
git clone https://github.com/Dibyendu-13/ANONY_MENTAL_HEALTH_WEBSITE/backend
cd backend
```
Install dependencies:

```
npm install
```

### Start the server:

```
npm start
For development with real-time updates:
```

```
npm run dev
```
## API Endpoints

### Authentication

 /api/auth/register: Register a new user.

**POST** /api/auth/login: Login a user and retrieve a JWT.

**GET** /api/auth/check-username/:username: Check if a username is available.

### Chats

**POST** /api/chat-requests/request: Send a chat request.

**GET** /api/chat-requests/requests: GET all chat requests for the authenticated user.

**GET** /api/chat-requests/room/:requestId: Fetch chat room for a request.

**POST** /api/chat-requests/respond: Respond to a chat request (accept/reject).

**POST** /api/chat-messages/message: Send a message in a chat room.

**GET** /api/chat-messages/:chatRoomId/messages: GET all messages for a chat room.

### Posts

**POST** /api/posts: Create a new POST.

**GET** /api/posts: GET all POSTs.

**GET** /api/posts/:id: GET a single POST.

**POST** /api/posts/:id/comments: Add a comment to a POST.

**GET** /api/posts/:id/comments: GET all comments for a POST.

**POST** /api/posts/:id/likes: Update likes/dislikes for a POST.

### Questions

**POST** /api/questions: Create a question with content validation.

**GET** /api/questions: Fetch all questions.

### Notifications

**GET** /api/notifications: Fetch notifications for the user.

**DELETE** /api/notifications/:id: Delete a specific notification.

**DELETE** /api/notifications: Delete all notifications.

**Real-Time Communication**

**Join Room**: Clients connect to specific chat rooms using Socket.IO.

**Send Message**: Messages are broadcast in real time to all participants in a room.

**Receive Notifications**: Notifications are emitted to specific users for chat events.

**Error Handling**

Centralized error handling middleware for catching exceptions and providing meaningful error responses.

Validation for required parameters in each API endpoint.

Authorization checks for protected resources.

**Future Enhancements**

**Pagination**: Add pagination for fetching posts, comments, and messages.

**File Uploads**: Allow users to upload files or images in chat and posts.

**Admin Dashboard**: Manage posts, users, and reported content.

**Rate Limiting**: Prevent abuse with rate-limiting middleware.
