// APP.JS - Main application component
// Sets up routing and overall app structure

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Analytics from './pages/Analytics';
import Companies from './pages/Companies';
import './App.css';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    // Router wraps everything to enable navigation
    <Router>
      <div className="App">
        {/* Navbar appears on all pages */}
        <Navbar />
        
        {/* Routes define which component to show for each URL */}
        <Routes>
          {/* Home page - http://localhost:3000/ */}
          <Route path="/" element={<Home />} />
          
          {/* Jobs list page - http://localhost:3000/jobs */}
          <Route path="/jobs" element={<Jobs />} />
          
          {/* Single job detail - http://localhost:3000/jobs/123 */}
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Analytics page - http://localhost:3000/analytics */}
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Companies page - http://localhost:3000/companies */}
          <Route path="/companies" element={<Companies />} />
          
          {/* 404 Not Found - any other URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Footer appears on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

// 404 Not Found Component
function NotFound() {
  return (
    <div className="container my-5 text-center">
      <div className="py-5">
        <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h1 className="mt-4">404 - Page Not Found</h1>
        <p className="text-muted fs-5">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary btn-lg mt-3">
          <i className="bi bi-house me-2"></i>
          Go Back Home
        </a>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer 
      className="mt-5 py-5"
      style={{
        background: '#1F2937',
        color: 'white'
      }}>
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5>
              <i className="bi bi-graph-up-arrow me-2"></i>
              SkillScope
            </h5>
            <p className="mt-3 text-light opacity-75">
              Your gateway to understanding the job market. Track trends, 
              discover opportunities, and make informed career decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <a href="/" className="text-light text-decoration-none opacity-75">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/jobs" className="text-light text-decoration-none opacity-75">
                  Browse Jobs
                </a>
              </li>
              <li className="mb-2">
                <a href="/analytics" className="text-light text-decoration-none opacity-75">
                  Analytics
                </a>
              </li>
              <li className="mb-2">
                <a href="/companies" className="text-light text-decoration-none opacity-75">
                  Companies
                </a>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div className="col-md-4 mb-4">
            <h6>Data Sources</h6>
            <ul className="list-unstyled mt-3">
              <li className="mb-2 text-light opacity-75">
                <i className="bi bi-check-circle me-2"></i>
                WeWorkRemotely
              </li>
              <li className="mb-2 text-light opacity-75">
                <i className="bi bi-check-circle me-2"></i>
                Real-time Analytics
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center pt-3">
          <p className="mb-0 opacity-75">
            &copy; 2024 SkillScope. Built with React, Django & PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;