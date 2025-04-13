// This is a mock API service for development purposes
// In production, this would be replaced with real API calls to your microservices

// Mock data for passwords
const mockPasswords = [
  {
    id: '1',
    title: 'Gmail',
    username: 'user@gmail.com',
    password: 'strongPassword1!',
    website: 'https://gmail.com',
    userId: '1'
  },
  {
    id: '2',
    title: 'GitHub',
    username: 'devuser',
    password: 'gitHubSecure!2023',
    website: 'https://github.com',
    userId: '1'
  },
  {
    id: '3',
    title: 'Netflix',
    username: 'moviefan',
    password: 'N3tflixAccount!',
    website: 'https://netflix.com',
    userId: '1'
  }
];

// Mock authentication
export const mockAuth = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // For demo, accept any non-empty username/password
        if (username && password) {
          resolve({
            token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
            user: {
              id: '1',
              username: username
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },
  
  logout: () => {
    return Promise.resolve();
  }
};

// Mock password API
export const mockPasswordApi = {
  getAll: () => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        resolve([...mockPasswords]);
      }, 800);
    });
  },
  
  add: (passwordData) => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const newPassword = {
          ...passwordData,
          id: Date.now().toString(),
          userId: '1'
        };
        mockPasswords.push(newPassword);
        resolve(newPassword);
      }, 600);
    });
  },
  
  update: (id, passwordData) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const index = mockPasswords.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPasswords[index] = { ...mockPasswords[index], ...passwordData };
          resolve(mockPasswords[index]);
        } else {
          reject(new Error('Password not found'));
        }
      }, 600);
    });
  },
  
  delete: (id) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const index = mockPasswords.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPasswords.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error('Password not found'));
        }
      }, 600);
    });
  }
};