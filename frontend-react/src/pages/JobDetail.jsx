// JobDetail.jsx - Single job detail page
// Shows complete information about one specific job

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/api';
import Loading from '../components/Loading';

const JobDetail = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details
  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Job not found or error loading data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (loading) return <Loading />;

  if (error || !job) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Job not found'}
        </div>
        <Link to="/jobs" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Jobs
        </Link>
      </div>
    );
  }

  const companyInitial = job.company?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="container my-5">

      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/jobs">Jobs</Link></li>
          <li className="breadcrumb-item active">{job.title}</li>
        </ol>
      </nav>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>

            {/* HEADER */}
            <div className="d-flex mb-4">
              <div
                className="d-flex align-items-center justify-content-center me-4"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  color: '#4F46E5',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                {companyInitial}
              </div>

              <div className="flex-grow-1">
                <h2 className="fw-bold mb-2">{job.title}</h2>
                <h5 className="text-muted mb-3">
                  <i className="bi bi-building me-2"></i>
                  {job.company?.name || 'Unknown Company'}
                </h5>

                <div>
                  <span className="badge bg-primary me-2 mb-2" style={{ padding: '8px 15px' }}>
                    <i className="bi bi-geo-alt me-1"></i>
                    {job.location ?
                      `${job.location.city}, ${job.location.country}` :
                      'Remote'}
                  </span>

                  <span className="badge bg-success me-2 mb-2" style={{ padding: '8px 15px' }}>
                    <i className="bi bi-briefcase me-1"></i>
                    {job.job_type?.replace('_', ' ') || 'Full Time'}
                  </span>

                  <span className="badge bg-warning me-2 mb-2" style={{ padding: '8px 15px' }}>
                    <i className="bi bi-star me-1"></i>
                    {job.experience_level || 'Mid Level'}
                  </span>

                  {job.salary_min && job.salary_max && (
                    <span className="badge bg-info me-2 mb-2" style={{ padding: '8px 15px' }}>
                      <i className="bi bi-currency-dollar me-1"></i>
                      ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* JOB STATS */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <i className="bi bi-calendar3 me-2"></i>
                  <strong>Posted:</strong><br />
                  {formatDate(job.posted_date)}
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <i className="bi bi-eye me-2"></i>
                  <strong>Views:</strong><br />
                  {job.views || 0}
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <i className="bi bi-clock-history me-2"></i>
                  <strong>Status:</strong><br />
                  <span className="text-success">Active</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <h4><i className="bi bi-file-text me-2"></i>Job Description</h4>
              <hr />
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                {job.description}
              </div>
            </div>

            {/* SKILLS */}
            <div className="mb-4">
              <h4><i className="bi bi-code-slash me-2"></i>Required Skills</h4>
              <hr />
              <div>
                {job.skills?.length > 0 ? (
                  job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="badge bg-light text-dark me-2 mb-2"
                      style={{ padding: '8px 16px', borderRadius: '20px' }}>
                      {skill.name || skill}
                    </span>
                  ))
                ) : (
                  <p className="text-muted">No specific skills listed</p>
                )}
              </div>
            </div>

            {/* TAGS */}
            {job.tags && (
              <div className="mb-4">
                <h4><i className="bi bi-tags me-2"></i>Tags</h4>
                <hr />
                <p className="text-muted">{job.tags}</p>
              </div>
            )}

            {/* APPLY BUTTON */}
            <div
              className="text-center p-4"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                borderRadius: '15px'
              }}>
              <h4 className="text-white mb-3">Interested in this position?</h4>

              <a
                href={job.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-lg"
                style={{ padding: '15px 40px', fontWeight: '600' }}>
                <i className="bi bi-box-arrow-up-right me-2"></i>
                Apply on {job.source?.name || 'WeWorkRemotely'}
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – SIDEBAR */}
        <div className="col-lg-4">

          {/* COMPANY INFO */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <h5><i className="bi bi-building me-2"></i>About the Company</h5>
            <hr />
            <div className="text-center mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  color: '#4F46E5',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                {companyInitial}
              </div>
            </div>

            <h6 className="text-center">{job.company?.name}</h6>
            <p className="text-muted">
              {job.company?.description || 'No description available'}
            </p>

            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm w-100">
                <i className="bi bi-globe me-2"></i>
                Visit Website
              </a>
            )}
          </div>

          {/* QUICK STATS */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <h5><i className="bi bi-info-circle me-2"></i>Quick Stats</h5>
            <hr />
            <ul className="list-unstyled mb-0">

              <li className="mb-3">
                <i className="bi bi-briefcase text-primary me-2"></i>
                <strong>Job Type:</strong> {job.job_type?.replace('_', ' ') || 'Full Time'}
              </li>

              <li className="mb-3">
                <i className="bi bi-star text-warning me-2"></i>
                <strong>Level:</strong> {job.experience_level || 'Mid Level'}
              </li>

              <li className="mb-3">
                <i className="bi bi-geo-alt text-success me-2"></i>
                <strong>Location:</strong>{' '}
                {job.location ?
                  `${job.location.city}, ${job.location.country}` :
                  'Remote Worldwide'}
              </li>

              <li className="mb-3">
                <i className="bi bi-calendar text-info me-2"></i>
                <strong>Posted:</strong> {getTimeAgo(job.posted_date)}
              </li>

              <li className="mb-0">
                <i className="bi bi-eye text-secondary me-2"></i>
                <strong>Views:</strong> {job.views || 0}
              </li>

            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;
