// StatCard.jsx - Displays statistics cards
// Shows numbers like "50 Jobs", "$120k Average Salary"

import React from 'react';

const StatCard = ({ icon, iconColor, value, label }) => {
  return (
    <div 
      className="card border-0 shadow-sm h-100"
      style={{
        borderRadius: '15px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }}>
      
      <div className="card-body p-4">
        {/* Icon Circle */}
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: `${iconColor}15`, // Semi-transparent background
            color: iconColor
          }}>
          <i className={`bi ${icon} fs-2`}></i>
        </div>
        
        {/* Value (big number) */}
        <h3 className="fw-bold mb-1">{value}</h3>
        
        {/* Label (description) */}
        <p className="text-muted mb-0">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;