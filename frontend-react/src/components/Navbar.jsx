// Navbar.jsx - Navigation bar component
// Shows at the top of every page

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark" 
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
        boxShadow: '0 2px 10px rgba(79, 70, 229, 0.1)'
      }}>
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-graph-up-arrow me-2"></i>
          SkillScope
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Browse Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/analytics">Analytics</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/companies">Companies</Link>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="http://127.0.0.1:8000/admin/" 
                target="_blank"
                rel="noopener noreferrer">
                <i className="bi bi-shield-lock"></i> Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;