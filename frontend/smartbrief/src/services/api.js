import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // it will prepend /api to all requests
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