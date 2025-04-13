import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Create the context
const AuthContext = createContext();

// Hook for easy context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (token && userId) {
          // Validate token with backend if needed
          setUser({ id: userId });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // API base URL - will be replaced with the actual Kubernetes service endpoint
      const AUTH_API_BASE_URL = "http://localhost:8081/api/auth"
      const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      
      // Update state
      setUser({ id: data.id });
      
      toast.success('Login successful', {
        description: 'Welcome back!'
      });
      
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      toast.error('Login failed', {
        description: err.message || 'Invalid credentials'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // API base URL - will be replaced with the actual Kubernetes service endpoint
      const AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

      const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      
      // Update state
      setUser({ id: data.id });
      
      toast.success('Registration successful', {
        description: 'Your account has been created!'
      });
      
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      toast.error('Registration failed', {
        description: err.message || 'Could not create account'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/');
    toast.success('Logged out', {
      description: 'You have been successfully logged out.'
    });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get current user ID
  const getCurrentUserId = () => {
    return user ? user.id : null;
  };

  // Get stored token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUserId,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;