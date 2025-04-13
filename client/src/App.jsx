import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import { useAuth } from "./lib/auth-context";
import { UserApi, PasswordsApi } from "./lib/api-client";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ value: "", website: "", username: "", description: "" });
  const { toast } = useToast();
  const { user, isAuthenticated, login, register, logout, loading } = useAuth();

  useEffect(() => {
    // If authenticated, fetch users
    if (isAuthenticated && user) {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(newUser.email, newUser.password);
      setNewUser({ ...newUser, email: "", password: "" });
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(newUser.username, newUser.email, newUser.password);
      setNewUser({ username: "", email: "", password: "", firstName: "", lastName: "" });
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Could not create account",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserApi.getUserProfile(user.id);
      // Since we're using a single user view in this implementation
      setUsers([response]);
      setSelectedUser(user.id);
      await fetchPasswords(user.id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const fetchPasswords = async (userId) => {
    try {
      const passwordsList = await PasswordsApi.getAllPasswords(userId);
      setPasswords(passwordsList);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast({
        variant: "destructive",
        title: "Error fetching passwords",
        description: error.response?.data?.message || "Could not fetch passwords",
      });
    }
  };

  const storePassword = async (e) => {
    e.preventDefault();
    try {
      await PasswordsApi.createPassword(user.id, newPassword);
      setNewPassword({ value: "", website: "", username: "", description: "" });
      await fetchPasswords(user.id);
      toast({
        title: "Password stored",
        description: "The password was stored successfully",
      });
    } catch (error) {
      console.error("Error storing password:", error);
      toast({
        variant: "destructive",
        title: "Error storing password",
        description: error.response?.data?.message || "Could not store password",
      });
    }
  };

  const deletePassword = async (passwordId) => {
    try {
      await PasswordsApi.deletePassword(user.id, passwordId);
      await fetchPasswords(user.id);
      toast({
        title: "Password deleted",
        description: "The password was deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast({
        variant: "destructive",
        title: "Error deleting password",
        description: error.response?.data?.message || "Could not delete password",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
          <p>Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  // Login/Register Form
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <Toaster />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">SecureIt Password Manager</CardTitle>
            <CardDescription className="text-center">Login or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="First Name"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Last Name"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">Register</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main app after login
  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SecureIt Password Manager</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.username}</span>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Passwords</CardTitle>
            <CardDescription>Manage your secure passwords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">New Password</h3>
                <form onSubmit={storePassword} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Website"
                      value={newPassword.website}
                      onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Username"
                      value={newPassword.username}
                      onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={newPassword.value}
                      onChange={(e) => setNewPassword({ ...newPassword, value: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Description"
                      value={newPassword.description}
                      onChange={(e) => setNewPassword({ ...newPassword, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit">Store Password</Button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Stored Passwords</h3>
                <Table>
                  <TableCaption>Your stored passwords</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {passwords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No passwords stored yet</TableCell>
                      </TableRow>
                    ) : (
                      passwords.map(password => (
                        <TableRow key={password.id}>
                          <TableCell>{password.website}</TableCell>
                          <TableCell>{password.username}</TableCell>
                          <TableCell>{password.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => alert(`Password: ${password.value}`)}>
                                View
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deletePassword(password.id)}>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => fetchPasswords(user.id)}>Refresh Passwords</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
