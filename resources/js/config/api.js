import axios from 'axios';
import Cookies from 'js-cookie';

// Create Axios instance
const api = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const sanctumToken = Cookies.get('sanctum_token'); 
  if (sanctumToken) {
    config.headers['Authorization'] = `Bearer ${sanctumToken}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const setAuthorizationToken = (token) => {
  if (token) {
    Cookies.set('sanctum_token', token, { path: '/' }); // Update token in cookies
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    Cookies.remove('sanctum_token');
    delete api.defaults.headers['Authorization'];
  }
};

export default api;
