// This file handles ALL communication with Django backend
// Think of it as a messenger between React and Django
// Each function is like asking Django: "Hey, give me job data!"


import axios from 'axios';

// Django backend URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// JOB ENDPOINTS
// ============================================

/**
 * Get all jobs
 * @param {Object} filters - Optional filters (search, location, etc.)
 * @returns {Promise} - List of jobs
 */
export const getJobs = async (filters = {}) => {
  try {
    // Build query string from filters
    // Example: { search: 'python', location: 'remote' } 
    // becomes: ?search=python&location=remote
    const queryString = new URLSearchParams(filters).toString();
    
    const response = await api.get(`/jobs/?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Get a single job by ID
 * @param {number} id - Job ID
 * @returns {Promise} - Job details
 */
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

/**
 * Get recent jobs (posted in last 7 days)
 * @returns {Promise} - List of recent jobs
 */
export const getRecentJobs = async () => {
  try {
    const response = await api.get('/jobs/recent_jobs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    throw error;
  }
};

// ============================================
// COMPANY ENDPOINTS
// ============================================

/**
 * Get all companies
 * @returns {Promise} - List of companies
 */
export const getCompanies = async () => {
  try {
    const response = await api.get('/companies/');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Get a single company by ID
 * @param {number} id - Company ID
 * @returns {Promise} - Company details
 */
export const getCompanyById = async (id) => {
  try {
    const response = await api.get(`/companies/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

// ============================================
// SKILL ENDPOINTS
// ============================================

/**
 * Get all skills
 * @returns {Promise} - List of skills
 */
export const getSkills = async () => {
  try {
    const response = await api.get('/skills/');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

/**
 * Get top demanded skills
 * @returns {Promise} - List of top skills
 */
export const getTopSkills = async () => {
  try {
    const response = await api.get('/skills/top_demanded/');
    return response.data;
  } catch (error) {
    console.error('Error fetching top skills:', error);
    throw error;
  }
};

// ============================================
// LOCATION ENDPOINTS
// ============================================

/**
 * Get all locations
 * @returns {Promise} - List of locations
 */
export const getLocations = async () => {
  try {
    const response = await api.get('/locations/');
    console.log('Locations data:', response.data );
    return response.data;

  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

/**
 * Get analytics data (for charts)
 * This isn't a real endpoint yet, but shows how you'd implement it
 */
export const getAnalytics = async () => {
  try {
    // For now, we'll aggregate from existing endpoints
    const [jobs, skills, companies] = await Promise.all([
      getJobs(),
      getTopSkills(),
      getCompanies()
    ]);
    
    return {
      totalJobs: jobs.count || jobs.length,
      topSkills: skills,
      topCompanies: companies.slice(0, 10)
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Export the api instance for advanced use
export default api;