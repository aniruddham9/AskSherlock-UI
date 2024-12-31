import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './input.css';
import ChatInterface from './Components/ChatInterface';
import MagnifierScreen from './Components/MagnifierScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MagnifierScreen />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
