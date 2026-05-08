import axios from 'axios';

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
});
