import axios from 'axios';

const API_URL = 'https://travelmatess.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData vs JSON
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (config.data && typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors
    console.error('API Error:', error.response?.status, error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use window.location for hard redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Server errors
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }

    // Return error for component handling
    return Promise.reject(error);
  }
);

export default api;