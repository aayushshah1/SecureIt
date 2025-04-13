// API base URL - will be replaced with the actual Kubernetes service endpoint
const AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw handleError(response.status, errorData);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
      }
      return data;
  },

  // Login with email and password
  login: async (email, password) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw handleError(response.status, errorData);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
      }
      return data;
  },

  // Logout user - clear local storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user ID
  getCurrentUserId: () => {
    return localStorage.getItem('userId');
  }
};

// Helper function to handle errors
const handleError = (status, errorData) => {
  if (status === 401) {
    // Handle unauthorized
    return {
      status: 401,
      message: errorData.message || 'Authentication failed'
    };
  } else if (status === 400) {
    // Handle bad request
    return {
      status: 400,
      message: errorData.message || 'Invalid request'
    };
  } else {
    // Handle other errors
    return {
      status: status || 500,
      message: errorData.message || 'An unexpected error occurred'
    };
  }
};

export default authService;