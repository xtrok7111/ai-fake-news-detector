import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    auth.logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    'nav-link' + (location.pathname === path ? ' nav-link-active' : '');

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <img src="/logo.png" alt="Fake News Detector" className="brand-logo" />
          <span className="brand-text">Fake News Detector</span>
        </Link>
      </div>

      <button
        className={`nav-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className={linkClass('/')} onClick={() => setMenuOpen(false)}>
          Analyze
        </Link>
        <Link to="/dashboard" className={linkClass('/dashboard')} onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>
        <Link to="/model-info" className={linkClass('/model-info')} onClick={() => setMenuOpen(false)}>
          Model Info
        </Link>
        <Link to="/about" className={linkClass('/about')} onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
        <span className="nav-user">{user?.name}</span>
        <button className="nav-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
