import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ModelInfo from './pages/ModelInfo';
import About from './pages/About';
import { auth } from './api';

function Protected({ children }) {
  return auth.isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  return auth.isLoggedIn() ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/model-info" element={<Protected><ModelInfo /></Protected>} />
        <Route path="/about" element={<Protected><About /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
