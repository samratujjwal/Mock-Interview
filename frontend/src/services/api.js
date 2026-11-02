import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true, // include cookies for refresh token
});

export default api;
