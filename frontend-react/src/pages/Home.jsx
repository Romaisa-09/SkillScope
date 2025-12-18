// Home.jsx - Homepage component
// Shows statistics, search bar, top skills chart, and recent jobs

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getJobs, getTopSkills, getCompanies, getLocations } from '../services/api';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  // State variables - data that can change
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalSkills: 0,
    totalLocations: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  const navigate = useNavigate();

  // Fetch data when component loads
  useEffect(() => {
    fetchHomeData();
  }, []);
console.log('TOTAL JOBS', stats.totalJobs);
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [jobsData, skillsData, companiesData, locationsData] = await Promise.all([
        getJobs({ page_size: 10 }),
        getTopSkills(),
        getCompanies(),
        getLocations()
      ]);

      // Update statistics
      setStats({
        totalJobs: jobsData.count || jobsData.length || 0,
        totalCompanies: companiesData.count || companiesData.length || 0,
        totalSkills: skillsData.count || skillsData.length || 0,
        totalLocations: locationsData.count|| locationsData.length || 0
      });

      // Set recent jobs (first 6 for display)
      setRecentJobs(jobsData.results?.slice(0, 6) || jobsData.slice(0, 6) || []);
      
      // Set top skills for chart (first 8)
      setTopSkills(skillsData.slice(0, 8) || []);

    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build URL parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    
    // Navigate to jobs page with search parameters
    navigate(`/jobs?${params.toString()}`);
  };

  // Prepare chart data
  const chartData = {
    labels: topSkills.map(skill => skill.name),
    datasets: [
      {
        label: 'Number of Jobs',
        data: topSkills.map(skill => skill.job_count || 0),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(132, 204, 22, 0.8)',
        ],
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* HERO SECTION - Top banner */}
      <section 
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
          color: 'white'
        }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">
                Discover Your Next Career Move
              </h1>
              <p className="lead mb-4">
                Track job trends, analyze market demands, and find opportunities that match your skills
              </p>

              {/* SEARCH BOX */}
              <div 
                className="card border-0 p-3"
                style={{
                  borderRadius: '50px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}>
                <form onSubmit={handleSearch}>
                  <div className="row g-2">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Job title or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '15px 25px', fontSize: '1rem' }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Location..."
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        style={{ padding: '15px 25px', fontSize: '1rem' }}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        type="submit"
                        className="btn w-100"
                        style={{
                          background: '#10B981',
                          color: 'white',
                          borderRadius: '50px',
                          padding: '15px',
                          fontWeight: '600',
                          border: 'none'
                        }}>
                        <i className="bi bi-search me-2"></i>
                        Search Jobs
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS CARDS */}
      <section className="container my-5">
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <StatCard
              icon="bi-briefcase"
              iconColor="#4F46E5"
              value={stats.totalJobs}
              label="Active Job Listings"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <StatCard
              icon="bi-building"
              iconColor="#10B981"
              value={stats.totalCompanies}
              label="Companies Hiring"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <StatCard
              icon="bi-code-slash"
              iconColor="#F59E0B"
              value={stats.totalSkills}
              label="Skills Tracked"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <StatCard
              icon="bi-geo-alt"
              iconColor="#EF4444"
              value={stats.totalLocations}
              label="Locations Covered"
            />
          </div>
        </div>
      </section>

      {/* TOP SKILLS CHART */}
      <section className="container my-5">
        <h2 className="text-center mb-4">
          🔥 Top Demanded Skills
        </h2>
        <div 
          className="card border-0 shadow-sm p-4"
          style={{ borderRadius: '15px' }}>
          {topSkills.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-center text-muted">No skill data available</p>
          )}
        </div>
      </section>

      {/* RECENT JOBS SECTION */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Latest Job Postings</h2>
          <Link 
            to="/jobs"
            className="btn"
            style={{
              background: '#4F46E5',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 25px',
              fontWeight: '600',
              border: 'none'
            }}>
            View All Jobs <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="row g-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No jobs available yet. Run the scraper to fetch jobs!
          </div>
        )}
      </section>

      {/* CALL TO ACTION */}
      <section className="container my-5">
        <div 
          className="text-center p-5"
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            borderRadius: '20px',
            color: 'white'
          }}>
          <h2 className="mb-3">Ready to Explore Market Insights?</h2>
          <p className="mb-4 fs-5">Dive deep into job market analytics and trends</p>
          <Link
            to="/analytics"
            className="btn btn-light btn-lg"
            style={{
              padding: '15px 40px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
            <i className="bi bi-graph-up me-2"></i>
            View Analytics Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;