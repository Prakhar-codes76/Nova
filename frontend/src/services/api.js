import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Bearer token into outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('nova_token');
    }

    let message = 'An unexpected API error occurred.';
    if (!error.response) {
      message = 'Unable to connect to Nova server. Please try again.';
    } else if (error.response.data?.detail) {
      message = typeof error.response.data.detail === 'string' 
        ? error.response.data.detail 
        : JSON.stringify(error.response.data.detail);
    } else if (error.response.status === 500) {
      message = 'Nova server encountered an internal error. Please try again.';
    } else if (error.message) {
      message = error.message;
    }

    const customError = {
      message,
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default api;
