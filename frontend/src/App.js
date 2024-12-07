import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuestionDetails from './pages/QuestionDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPost from './pages/AddPost';
import Notifications from './components/Notification';
import ChatRequestList from './components/ChatRequestList'; // New: Chat Request List
import ChatRoom from './components/ChatRoom'; // New: Chat Room

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" /> {/* Toast notifications */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/question/:id" element={<QuestionDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat-requests" element={<ChatRequestList />} /> {/* New: Chat Requests */}
        <Route path="/chat-room/:chatRoomId" element={<ChatRoom />} /> {/* New: Chat Room */}
      </Routes>
    </Router>
  );
};

export default App;
