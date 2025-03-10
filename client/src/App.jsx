import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
const API_BASE_URL = "http://pm.backend/api";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ value: "", website: "", username: "", description: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const storePassword = async () => {
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

  return (
    <div>
      <h1>Password Manager</h1>

      <h2>Create User</h2>
      <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
      <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
      <input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <input placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
      <input placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
      <button onClick={createUser}>Create</button>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => selectUser(user.id)}>Select</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h2>Store Password</h2>
          <input placeholder="Website" value={newPassword.website} onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })} />
          <input placeholder="Username" value={newPassword.username} onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })} />
          <input placeholder="Password" value={newPassword.value} onChange={(e) => setNewPassword({ ...newPassword, value: e.target.value })} />
          <input placeholder="Description" value={newPassword.description} onChange={(e) => setNewPassword({ ...newPassword, description: e.target.value })} />
          <button onClick={storePassword}>Store</button>

          <h2>Stored Passwords</h2>
          <ul>
            {passwords.map(password => (
              <li key={password.id}>
                {password.website} - {password.username}
                <button onClick={() => deletePassword(password.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
