import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './input.css';
import ChatInterface from './Components/ChatInterface';
import MagnifierScreen from './Components/MagnifierScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MagnifierScreen />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
};

export default App;
