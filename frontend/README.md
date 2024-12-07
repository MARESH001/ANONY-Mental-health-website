# ANONY Frontend Application

## Introduction

This frontend application is designed to provide a platform for creating and managing posts, questions, and chat requests. It includes features like voting, commenting, and real-time chat functionalities.

---

## Features

### 1. **Post Management**
- **Create, View, and Discuss Posts:**
  - Users can create posts with tags and view discussions.
  - Voting functionality (upvote/downvote) with dynamic updates.
  - Add and view comments in real time.
  - Request chats with comment authors directly from the post.

### 2. **Question Management**
- Users can view questions with tags and interact by upvoting or downvoting.
- View detailed discussions on specific questions.

### 3. **Chat Requests**
- Request private chats with other users based on comments or posts.
- Integration with the backend to handle real-time chat initiation.

---

## Components Overview

### 1. **PostCard**
- Displays post details, voting functionality, comments, and chat request options.
- Handles:
  - Fetching vote status and comments dynamically.
  - Adding comments and sending chat requests.

### 2. **QuestionCard**
- Displays question content, tags, and voting options.
- Includes a "View Details" button for navigating to full question discussions.

---

## Technologies Used

### Frontend
- **React**: Core library for UI development.
- **Material-UI**: UI component library for styling.
- **React Router**: For navigation between pages.
- **Axios**: For API integration.

### Backend Integration
- API endpoints integrated using Axios for:
  - Fetching posts and questions.
  - Voting on posts/questions.
  - Adding comments.
  - Sending chat requests.

---

## Installation

### Prerequisites
- Node.js and npm installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Dibyendu-13/ANONY_MENTAL_HEALTH_WEBSITE/frontend
   cd frontend
   ```
   
Install dependencies:

```
npm install
```

Start the development server:

```
npm start
```
**Component Details**
**PostCard**

Handles displaying posts and enabling user interaction:

**Props**:
post: Object containing post details (e.g., title, content, tags, likes, comments).

**Features**:

Displays title, content, tags, and vote count.
Allows users to upvote/downvote with feedback.
Displays existing comments and allows adding new ones.
Sends chat requests to comment authors.

**QuestionCard**

Handles displaying questions with tags and voting options:

**Props**:
question: Object containing question details (e.g., content, tags, likes, dislikes).

**Features**:
Displays question content, tags, and vote count.
"View Details" button navigates to the detailed question discussion page.

**API Endpoints Used**

**Posts**
**GET** /api/posts: Fetch all posts.
**POST** /api/posts: Create a new post.
**POST** /api/posts/:id/comments: Add a comment to a post.
**GET** /api/posts/:id/comments: Fetch all comments for a post.
**POST** /api/posts/:id/likes: Update votes (upvote/downvote).
**GET** /api/posts/:id/vote-status: Fetch vote status for the authenticated user.

**Questions**

**GET** /api/questions: Fetch all questions.
**POST** /api/questions: Create a new question.

**Chat Requests**
**POST** /api/chat-requests/request: Send a chat request for a comment or post.
