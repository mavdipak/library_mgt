import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<div>Welcome to the Library</div>} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
