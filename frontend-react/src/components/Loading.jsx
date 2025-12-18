// Loading.jsx - Loading spinner component
// Shows while data is being fetched from API

import React from 'react';

const Loading = () => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: '400px' }}>
      <div className="text-center">
        {/* Bootstrap spinner */}
        <div 
          className="spinner-border"
          style={{ width: '3rem', height: '3rem', color: '#4F46E5' }}
          role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading data...</p>
      </div>
    </div>
  );
};

export default Loading;