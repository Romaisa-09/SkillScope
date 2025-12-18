// Jobs.jsx - Browse all jobs page
// Shows job listings with search and filter functionality

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Jobs = () => {
  // Get URL parameters (for search queries)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    experience: searchParams.get('experience') || '',
    skill: searchParams.get('skill') || ''
  });

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build query object (only include non-empty filters)
      const query = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          query[key] = filters[key];
        }
      });

      // Call API with filters
      const data = await getJobs(query);
      
      // Handle both paginated and non-paginated responses
      if (data.results) {
        setJobs(data.results);
        setTotalCount(data.count);
      } else {
        setJobs(data);
        setTotalCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    // Update filters state
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Update URL parameters (so user can bookmark/share filtered view)
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: '',
      experience: '',
      skill: ''
    });
    setSearchParams({});
  };

  return (
    <div className="container my-5">
      {/* PAGE HEADER */}
      <div className="mb-4">
        <h1>
          <i className="bi bi-briefcase me-3"></i>
          Browse Job Listings
        </h1>
        <p className="text-muted">
          Found {totalCount} job{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* FILTER SECTION */}
      <div 
        className="card border-0 shadow-sm p-4 mb-4"
        style={{ borderRadius: '15px' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row g-3">
            {/* Search input */}
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 15px' }}
              />
            </div>

            {/* Location input */}
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 15px' }}
              />
            </div>

            {/* Job type dropdown */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.job_type}
                onChange={(e) => handleFilterChange('job_type', e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 15px' }}>
                <option value="">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Experience level dropdown */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 15px' }}>
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            {/* Skill input */}
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Skill (e.g. Python)"
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 15px' }}
              />
            </div>

            {/* Clear filters button */}
            <div className="col-md-1">
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline-secondary w-100"
                style={{ borderRadius: '8px', padding: '10px' }}
                title="Clear all filters">
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </form>

        {/* Active filters display */}
        {Object.values(filters).some(val => val) && (
          <div className="mt-3">
            <small className="text-muted">Active filters: </small>
            {filters.search && (
              <span className="badge bg-primary me-2">
                Search: {filters.search}
              </span>
            )}
            {filters.location && (
              <span className="badge bg-primary me-2">
                Location: {filters.location}
              </span>
            )}
            {filters.job_type && (
              <span className="badge bg-primary me-2">
                Type: {filters.job_type}
              </span>
            )}
            {filters.experience && (
              <span className="badge bg-primary me-2">
                Level: {filters.experience}
              </span>
            )}
            {filters.skill && (
              <span className="badge bg-primary me-2">
                Skill: {filters.skill}
              </span>
            )}
          </div>
        )}
      </div>

      {/* JOBS LIST */}
      {loading ? (
        <Loading />
      ) : jobs.length > 0 ? (
        <div className="row g-4">
          {jobs.map((job) => (
            <div key={job.id} className="col-md-6 col-lg-4">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No jobs found matching your criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default Jobs;