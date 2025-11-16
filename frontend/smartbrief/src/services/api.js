import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://smartbrief-ai-news-summariser-1.onrender.com/api'
    : '/api', // Use full URL in production, proxy in development
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Interceptor to add the auth token to every request if it exists.
  This is crucial for your protected routes.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;