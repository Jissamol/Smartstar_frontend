import axios from 'axios';

// Create an axios instance with the base URL of your API
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust this to your Django API URL
});

// Add an interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 