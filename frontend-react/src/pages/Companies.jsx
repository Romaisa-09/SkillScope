// Companies.jsx - Companies listing page
// Shows all companies that are hiring

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies } from '../services/api';
import Loading from '../components/Loading';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies when component loads
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('Fetching companies...');
      const data = await getCompanies();
      console.log('Companies data received:', data);

      // Handle both array and paginated response
      const companiesList = Array.isArray(data) ? data : (data.results || []);
      console.log('Companies list:', companiesList);

      // Filter companies with at least 1 job
      const companiesWithJobs = companiesList.filter(
        (company) => company.job_count && company.job_count > 0
      );
      console.log('Companies with jobs:', companiesWithJobs);

      // Sort by job count (descending)
      companiesWithJobs.sort((a, b) => b.job_count - a.job_count);

      setCompanies(companiesWithJobs);
      
      if (companiesWithJobs.length === 0) {
        setError('No companies found with active jobs. Run the scraper to fetch data!');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner
  if (loading) return <Loading />;

  return (
    <div className="container my-5">
      {/* PAGE HEADER */}
      <div className="text-center mb-5">
        <h1>
          <i className="bi bi-building me-3"></i>
          Companies Hiring
        </h1>
        <p className="text-muted fs-5">
          Discover companies actively looking for talent
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-warning text-center mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* COMPANIES GRID */}
      {companies.length > 0 ? (
        <div className="row g-4">
          {companies.map((company) => (
            <div key={company.id} className="col-md-6 col-lg-4">
              <div
                className="card border-0 shadow-sm h-100 text-center"
                style={{
                  borderRadius: '15px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 10px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div className="card-body p-4">
                  {/* Company Logo Initial */}
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '15px',
                      background: '#F9FAFB',
                      color: '#4F46E5',
                      fontSize: '2rem',
                      fontWeight: '700',
                    }}
                  >
                    {company.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Company Name */}
                  <h5 className="fw-bold mb-2">{company.name}</h5>

                  {/* Description */}
                  <p className="text-muted small mb-3">
                    {company.description
                      ? company.description.substring(0, 100) + '...'
                      : 'Technology company'}
                  </p>

                  {/* Job Count Badge */}
                  <span
                    className="badge mb-3"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    {company.job_count} Open Position
                    {company.job_count !== 1 ? 's' : ''}
                  </span>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <Link
                      to={`/jobs?search=${encodeURIComponent(company.name)}`}
                      className="btn btn-sm"
                      style={{
                        background: '#4F46E5',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '10px',
                        fontWeight: '600',
                        border: 'none',
                      }}
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Jobs
                    </Link>

                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                        style={{
                          borderRadius: '8px',
                          padding: '10px',
                          fontWeight: '600',
                        }}
                      >
                        <i className="bi bi-globe me-2"></i>
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No companies found. Run the scraper to fetch company data!
          </div>
        )
      )}
    </div>
  );
};

export default Companies;