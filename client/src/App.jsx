import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const API_BASE_URL = "http://127.0.0.1:8080/api";

function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [authError, setAuthError] = useState('');
  
  // User management states
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });
  const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Password management states
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ value: "", website: "", username: "", description: "" });
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      // Support test email login - bypass actual authentication
      if (loginCredentials.email === "test@example.com") {
        localStorage.setItem('authToken', 'test-token');
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        fetchUsers();
        return;
      }
      
      // Regular login flow
      const user = users.find(u => u.email === loginCredentials.email);
      if (user && loginCredentials.password === "password") { // In real app, use proper password check
        localStorage.setItem('authToken', 'demo-token');
        setIsAuthenticated(true);
        setCurrentView('dashboard');
      } else {
        setAuthError('Invalid email or password');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentView('login');
    setSelectedUser(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      await axios.post(`${API_BASE_URL}/users`, newUser);
      setNewUser({ username: "", email: "", password: "", firstName: "", lastName: "" });
      setCurrentView('login');
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
      console.error("Registration error:", error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users`, newUser);
      setNewUser({ username: "", email: "", password: "", firstName: "", lastName: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const selectUser = async (userId) => {
    setSelectedUser(userId);
    try {
      const response = await axios.get(`${API_BASE_URL}/passwords/user/${userId}`);
      setPasswords(response.data);
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };

  const storePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/passwords/user/${selectedUser}`, newPassword);
      setNewPassword({ value: "", website: "", username: "", description: "" });
      selectUser(selectedUser);
    } catch (error) {
      console.error("Error storing password:", error);
    }
  };

  const deletePassword = async (passwordId) => {
    try {
      await axios.delete(`${API_BASE_URL}/passwords/user/${selectedUser}/${passwordId}`);
      selectUser(selectedUser);
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Login View
  if (currentView === 'login') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Password Manager</h1>
          <h2>Login</h2>
          {authError && <div className="error-message">{authError}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={loginCredentials.email} 
                onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={loginCredentials.password} 
                onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">Login</button>
          </form>
          
          <p className="auth-switch">
            Don't have an account? 
            <button onClick={() => setCurrentView('register')} className="btn-link">Register</button>
          </p>
        </div>
      </div>
    );
  }

  // Register View
  if (currentView === 'register') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Password Manager</h1>
          <h2>Create Account</h2>
          {authError && <div className="error-message">{authError}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={newUser.username} 
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={newUser.firstName} 
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={newUser.lastName} 
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">Register</button>
          </form>
          
          <p className="auth-switch">
            Already have an account? 
            <button onClick={() => setCurrentView('login')} className="btn-link">Login</button>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Password Manager</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="user-section">
            <h2>Users</h2>
            <div className="add-user-form">
              <h3>Add New User</h3>
              <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
              <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <input placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
              <input placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
              <button onClick={createUser} className="btn-primary">Create</button>
            </div>
            
            <div className="users-list">
              <h3>Manage Users</h3>
              <ul>
                {users.map(user => (
                  <li key={user.id} className={selectedUser === user.id ? 'selected' : ''}>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                      <span className="email">{user.email}</span>
                    </div>
                    <div className="user-actions">
                      <button onClick={() => selectUser(user.id)} className="btn-select">Select</button>
                      <button onClick={() => deleteUser(user.id)} className="btn-delete">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="main-content">
          {selectedUser ? (
            <div className="password-section">
              <div className="add-password-form">
                <h2>Add New Password</h2>
                <form onSubmit={storePassword}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Website</label>
                      <input 
                        type="text" 
                        value={newPassword.website} 
                        onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        value={newPassword.username} 
                        onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        value={newPassword.value} 
                        onChange={(e) => setNewPassword({ ...newPassword, value: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <input 
                        type="text" 
                        value={newPassword.description} 
                        onChange={(e) => setNewPassword({ ...newPassword, description: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-primary">Store Password</button>
                </form>
              </div>

              <div className="passwords-list">
                <h2>Stored Passwords</h2>
                {passwords.length === 0 ? (
                  <p className="no-passwords">No passwords stored yet.</p>
                ) : (
                  <ul>
                    {passwords.map(password => (
                      <li key={password.id} className="password-card">
                        <div className="password-info">
                          <h3>{password.website}</h3>
                          <p><strong>Username:</strong> {password.username}</p>
                          <p className="password-field">
                            <strong>Password:</strong> 
                            <span className="password-value">
                              {showPassword[password.id] ? password.value : '••••••••'}
                            </span>
                            <button 
                              onClick={() => togglePasswordVisibility(password.id)}
                              className="btn-toggle-password"
                            >
                              {showPassword[password.id] ? 'Hide' : 'Show'}
                            </button>
                          </p>
                          {password.description && <p><strong>Notes:</strong> {password.description}</p>}
                        </div>
                        <div className="password-actions">
                          <button onClick={() => deletePassword(password.id)} className="btn-delete">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <h2>Welcome to your Password Manager</h2>
              <p>Select a user from the sidebar to manage passwords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
