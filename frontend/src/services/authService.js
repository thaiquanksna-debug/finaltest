// src/services/authService.js
import { apiCall } from './api';

const authService = {
  async login(email, password) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  async register(name, email, password) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  async getMe() {
    return await apiCall('/auth/me');
  },

  logout() {
    localStorage.removeItem('token');
  },
};

export default authService;