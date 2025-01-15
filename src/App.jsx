import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './input.css';
import ChatInterface from './Components/ChatInterface';
import MagnifierScreen from './Components/MagnifierScreen';
// import FeedbackModal from './Components/Feedback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MagnifierScreen />} />
        <Route path="/chat" element={<ChatInterface />} />
        {/* <Route path="/feedback" element={<FeedbackModal />} /> */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
