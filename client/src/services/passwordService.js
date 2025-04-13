// API base URL - will be replaced with the actual Kubernetes service endpoint
const PM_API_BASE_URL = "http://localhost:8080/api/passwords";

const passwordService = {
  // Get all passwords for a user
  getAllPasswords: async (userId) => {
    const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${PM_API_BASE_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      return await response.json();
  },

  // Get a specific password
  getPassword: async (userId, passwordId) => {
    const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${PM_API_BASE_URL}/user/${userId}/${passwordId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      return await response.json();
  },

  // Add a new password
  addPassword: async (userId, passwordData) => {
    const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      console.log(passwordData)
      const response = await fetch(`${PM_API_BASE_URL}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      return await response.json();
  },

  // Update an existing password
  updatePassword: async (userId, passwordId, passwordData) => {
    const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${PM_API_BASE_URL}/user/${userId}/${passwordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      return await response.json();
  },

  // Delete a password
  deletePassword: async (userId, passwordId) => {
    const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${PM_API_BASE_URL}/user/${userId}/${passwordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      return await response.json();
  }
};

// Helper function to handle response errors
const handleResponseError = async (response) => {
  // Handle token expiration/unauthorized
  if (response.status === 401) {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/'; // Redirect to login page
    throw new Error('Your session has expired. Please log in again.');
  }
  
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  } catch (error) {
    // If the response doesn't contain valid JSON
    throw new Error(`Error: ${response.statusText}`);
  }
};

export default passwordService;