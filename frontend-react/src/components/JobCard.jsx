// JobCard.jsx - FIXED VERSION
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  // SAFETY CHECKS - Make sure data exists before using it
  if (!job) {
    return null; // Don't render anything if no job data
  }
  
  // Get company name safely
  // Check multiple possible structures from Django API
  const companyName = job.company?.name || job.company_name || 'Unknown Company';
  const companyInitial = companyName.charAt(0).toUpperCase();
  
  // Get location safely
  const locationDisplay = job.location 
    ? `${job.location.city}, ${job.location.country}` 
    : job.location_display || 'Remote';
  
  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div 
      className="card border-0 shadow-sm h-100"
      style={{
        borderRadius: '15px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        border: '1px solid #E5E7EB'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#4F46E5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}>
      
      <div className="card-body p-4">
        {/* Company Logo + Job Title */}
        <div className="d-flex mb-3">
          <div 
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              background: '#F9FAFB',
              color: '#4F46E5',
              fontWeight: '700',
              fontSize: '1.2rem'
            }}>
            {companyInitial}
          </div>
          
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 fw-semibold">{job.title || 'Untitled Job'}</h5>
            <p className="text-muted mb-0" style={{fontSize: '0.95rem'}}>
              <i className="bi bi-building me-1"></i>
              {companyName}
            </p>
          </div>
        </div>
        
        {/* Job Badges */}
        <div className="mb-3">
          <span 
            className="badge me-2 mb-2" 
            style={{
              background: 'rgba(79, 70, 229, 0.1)',
              color: '#4F46E5',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
            <i className="bi bi-geo-alt me-1"></i>
            {locationDisplay}
          </span>
          
          {job.job_type && (
            <span 
              className="badge me-2 mb-2"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}>
              <i className="bi bi-briefcase me-1"></i>
              {job.job_type.replace('_', ' ')}
            </span>
          )}
          
          {job.experience_level && (
            <span 
              className="badge me-2 mb-2"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#F59E0B',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}>
              <i className="bi bi-star me-1"></i>
              {job.experience_level}
            </span>
          )}
        </div>
        
        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-3">
            {job.skills.slice(0, 5).map((skill, index) => {
              // Handle both skill objects and skill names
              const skillName = typeof skill === 'string' ? skill : skill.name;
              
              return (
                <span 
                  key={index}//whats key and why use it
                  className="badge bg-light text-dark me-1 mb-1"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '400'
                  }}>
                  {skillName}
                </span>
              );
            })}
            {job.skills.length > 5 && (
              <span className="badge bg-light text-dark">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {getTimeAgo(job.posted_date)}
          </small>
          
          <Link 
            to={`/jobs/${job.id}`}
            className="btn btn-sm"
            style={{
              background: '#4F46E5',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 20px',
              fontWeight: '600',
              border: 'none'
            }}
            onMouseEnter={(e) => e.target.style.background = '#4338CA'}
            onMouseLeave={(e) => e.target.style.background = '#4F46E5'}>
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;