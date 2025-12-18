// Analytics.jsx - Analytics dashboard page
// Shows charts and statistics about job market data

import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { getJobs, getTopSkills, getCompanies } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  // State for statistics
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    avgSalary: 0
  });
  
  // State for chart data
  const [topSkillsData, setTopSkillsData] = useState(null);
  const [topCompaniesData, setTopCompaniesData] = useState(null);
  const [jobTypeData, setJobTypeData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);

  // Prepare chart functions with useCallback //function memoization
  //diff btw usecallback and useMemo

  const prepareTopSkillsChart = useCallback((skills) => {
    console.log('Preparing skills chart with data:', skills);
    
    if (!skills || skills.length === 0) {
      console.log('No skills data available');
      return;
    }

    const top10 = skills.slice(0, 10);
    
    setTopSkillsData({
      labels: top10.map(skill => skill.name),
      datasets: [{
        label: 'Number of Jobs',
        data: top10.map(skill => skill.job_count || 0),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(132, 204, 22, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderRadius: 8,
        borderWidth: 0
      }]
    });
  }, []);

  const prepareTopCompaniesChart = useCallback((companies) => {
    console.log('Preparing companies chart with data:', companies);
    
    if (!companies || companies.results.length === 0) {
      console.log('No companies data available');
      return;
    }
   
    
    const companiesWithCount = companies.results
      .filter(c => c.job_count && c.job_count > 0)
      .sort((a, b) => b.job_count - a.job_count)
      .slice(0, 10);

    if (companiesWithCount.length === 0) {
      console.log('No companies with jobs found');
      return;
    }

    setTopCompaniesData({
      labels: companiesWithCount.map(c => c.name),
      datasets: [{
        label: 'Number of Jobs',
        data: companiesWithCount.map(c => c.job_count),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(132, 204, 22, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderRadius: 8,
        borderWidth: 0
      }]
    });
  }, []);

  const prepareJobTypeChart = useCallback((jobs) => {
    console.log('Preparing job type chart with data:', jobs.length, 'jobs');
    
    if (!jobs || jobs.length === 0) {
      console.log('No jobs for job type chart');
      return;
    }

    const typeCounts = {};
    jobs.forEach(job => {
      const type = job.job_type || 'full_time';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    setJobTypeData({
      labels: Object.keys(typeCounts).map(type => 
        type.replace('_', ' ').toUpperCase()
      ),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 0
      }]
    });
  }, []);

  const prepareExperienceChart = useCallback((jobs) => {
    console.log('Preparing experience chart with data:', jobs.length, 'jobs');
    
    if (!jobs || jobs.length === 0) {
      console.log('No jobs for experience chart');
      return;
    }

    const expCounts = {};
    jobs.forEach(job => {
      const exp = job.experience_level || 'mid';
      expCounts[exp] = (expCounts[exp] || 0) + 1;
    });

    setExperienceData({
      labels: Object.keys(expCounts).map(exp => 
        exp.charAt(0).toUpperCase() + exp.slice(1)
      ),
      datasets: [{
        data: Object.values(expCounts),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }]
    });
  }, []);

  const prepareTimelineChart = useCallback((jobs) => {
    console.log('Preparing timeline chart with data:', jobs.length, 'jobs');
    
    if (!jobs || jobs.length === 0) {
      console.log('No jobs for timeline chart');
      return;
    }

    const dateCounts = {};
    const today = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateCounts[dateStr] = 0;
    }

    // Count jobs per date
    jobs.forEach(job => {
      const dateStr = job.posted_date;
      if (dateCounts.hasOwnProperty(dateStr)) {
        dateCounts[dateStr]++;
      }
    });

    setTimelineData({
      labels: Object.keys(dateCounts).map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [{
        label: 'Jobs Posted',
        data: Object.values(dateCounts),
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(79, 70, 229, 1)'
      }]
    });
  }, []);

  // Fetch all analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching analytics data...');

      // Fetch all data in parallel
      const [allJobsResponse, skillsData, companiesData] = await Promise.all([
        getJobs({ page_size: 1000 }),
        getTopSkills(),
        getCompanies()
      ]);

      console.log('Jobs response:', allJobsResponse);
      console.log('Skills data:', skillsData);
      console.log('Companies data:', companiesData);

      // Handle both array and paginated response
      const jobs = Array.isArray(allJobsResponse) 
        ? allJobsResponse 
        : (allJobsResponse.results || []);
      
      console.log('Total jobs:', jobs.length);

      if (jobs.length === 0) {
        console.warn('No jobs found! Run the scraper first.');
      }

      // Calculate average salary
      // Extract numeric salaries safely
const salaries = jobs
  .map(job => job.salary_min)
  .map(sal => {
    if (!sal) return null;

    // Convert strings like "5,000" → 5000
    const num = Number(String(sal).replace(/,/g, ''));

    return isNaN(num) ? null : num;
  })
  .filter(num => num !== null && num > 0);

console.log('Valid salaries:', salaries);

// Calculate average safely
const avgSalary = salaries.length
  ? salaries.reduce((a, b) => a + b, 0) / salaries.length
  : 0;

setStats({
  totalJobs: allJobsResponse.count || jobs.length,
  avgSalary: Math.round(avgSalary)
});




      // Prepare all chart data
      prepareTopSkillsChart(skillsData);
      prepareTopCompaniesChart(companiesData);
      prepareJobTypeChart(jobs);
      prepareExperienceChart(jobs);
      prepareTimelineChart(jobs);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [prepareTopSkillsChart, prepareTopCompaniesChart, prepareJobTypeChart, prepareExperienceChart, prepareTimelineChart]);

  // Fetch analytics data when component loads
  useEffect(() => {
    fetchAnalyticsData();
    return () => {

    }

  }, [fetchAnalyticsData]);

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 12 } }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // Show loading spinner
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section 
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
          color: 'white'
        }}>
        <div className="container text-center">
          <h1 className="display-5 fw-bold">
            <i className="bi bi-graph-up me-3"></i>
            Job Market Analytics
          </h1>
          <p className="lead">Deep insights into job market trends and demands</p>
        </div>
      </section>

      <div className="container my-5">
        {/* OVERVIEW STATS */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <StatCard
              icon="bi-briefcase"
              iconColor="#4F46E5"
              value={stats.totalJobs}
              label="Total Active Jobs"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon="bi-currency-dollar"
              iconColor="#10B981"
              value={stats.avgSalary > 0 ? `$${stats.avgSalary}` : 'N/A'}
              label="Average Salary (USD)"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon="bi-lightning"
              iconColor="#F59E0B"
              value="Live"
              label="Real-time Data"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon="bi-bar-chart"
              iconColor="#EF4444"
              value="7+"
              label="Key Metrics"
            />
          </div>
        </div>

        {/* NO DATA WARNING */}
        {stats.totalJobs === 0 && (
          <div className="alert alert-warning text-center mb-5">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>No data available!</strong> Run the scraper to fetch job data:
            <br />
            <code className="mt-2 d-inline-block">python manage.py scrape_weworkremotely</code>
          </div>
        )}

        {/* TIMELINE CHART */}
        {timelineData && (
          <div className="row mb-4">
            <div className="col-12">
              <div 
                className="card border-0 shadow-sm p-4"
                style={{ borderRadius: '15px' }}>
                <h4 className="mb-4">
                  <i className="bi bi-graph-up-arrow me-2"></i>
                  Job Postings Timeline (Last 30 Days)
                </h4>
                <Line data={timelineData} options={lineOptions} />
              </div>
            </div>
          </div>
        )}

        {/* TOP SKILLS & COMPANIES */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-sm p-4 h-100"
              style={{ borderRadius: '15px' }}>
              <h4 className="mb-4">
                <i className="bi bi-code-slash me-2"></i>
                Top 10 Most Demanded Skills
              </h4>
              {topSkillsData ? (
                <Bar data={topSkillsData} options={barOptions} />
              ) : (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No skills data available
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-sm p-4 h-100"
              style={{ borderRadius: '15px' }}>
              <h4 className="mb-4">
                <i className="bi bi-building me-2"></i>
                Top 10 Hiring Companies
              </h4>
              {topCompaniesData ? (
                <Bar data={topCompaniesData} options={barOptions} />
              ) : (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No companies data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* JOB TYPE & EXPERIENCE */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-sm p-4 h-100"
              style={{ borderRadius: '15px' }}>
              <h4 className="mb-4">
                <i className="bi bi-pie-chart me-2"></i>
                Jobs by Type
              </h4>
              {jobTypeData ? (
                <Doughnut data={jobTypeData} options={pieOptions} />
              ) : (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No job type data available
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-sm p-4 h-100"
              style={{ borderRadius: '15px' }}>
              <h4 className="mb-4">
                <i className="bi bi-star me-2"></i>
                Jobs by Experience Level
              </h4>
              {experienceData ? (
                <Pie data={experienceData} options={pieOptions} />
              ) : (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No experience data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KEY INSIGHTS */}
        <div className="row">
          <div className="col-12">
            <div 
              className="card border-0 p-4"
              style={{
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)'
              }}>
              <h4 className="mb-4">
                <i className="bi bi-lightbulb me-2"></i>
                Key Insights
              </h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm p-3 h-100">
                    <h5 className="text-primary">
                      <i className="bi bi-trophy me-2"></i>
                      Most In-Demand
                    </h5>
                    <p className="mb-0 small">
                      Technical skills like Python, JavaScript, and React dominate the job market
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm p-3 h-100">
                    <h5 className="text-success">
                      <i className="bi bi-graph-up me-2"></i>
                      Growing Trend
                    </h5>
                    <p className="mb-0 small">
                      Remote work opportunities have increased significantly across all sectors
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm p-3 h-100">
                    <h5 className="text-warning">
                      <i className="bi bi-currency-dollar me-2"></i>
                      Salary Range
                    </h5>
                    <p className="mb-0 small">
                      Senior positions offer 40-60% higher compensation than mid-level roles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;