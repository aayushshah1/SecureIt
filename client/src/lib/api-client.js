import axios from 'axios';
import AuthService from './auth-service';

// Create an axios instance for backend API calls
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Passwords API service
export const PasswordsApi = {
  // Get all passwords for current user
  getAllPasswords: async (userId) => {
    try {
      const response = await apiClient.get(`/passwords/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific password
  getPassword: async (userId, passwordId) => {
    try {
      const response = await apiClient.get(`/passwords/user/${userId}/${passwordId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new password
  createPassword: async (userId, passwordData) => {
    try {
      const response = await apiClient.post(`/passwords/user/${userId}`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update password
  updatePassword: async (userId, passwordId, passwordData) => {
    try {
      const response = await apiClient.put(`/passwords/user/${userId}/${passwordId}`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete password
  deletePassword: async (userId, passwordId) => {
    try {
      const response = await apiClient.delete(`/passwords/user/${userId}/${passwordId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// User API service
export const UserApi = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;