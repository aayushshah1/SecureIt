import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Trash2, Plus, Edit, LogOut, Copy, Key } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import passwordService from "../services/passwordService";

export default function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [newPassword, setNewPassword] = useState({
    description: "",
    username: "",
    value: "",
    website: "",
  });
  const [editingPassword, setEditingPassword] = useState(null);

  const navigate = useNavigate();
  const { user, logout, isAuthenticated, getCurrentUserId } = useAuth();

  useEffect(() => {

    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    fetchPasswords();
  }, [navigate, isAuthenticated]);

  const fetchPasswords = async () => {
    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      const data = await passwordService.getAllPasswords(userId);
      setPasswords(data);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast.error("Error", {
        description: error.message || "Failed to load your passwords. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      description: "Password copied to clipboard"
    });
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    try {
      const userId = getCurrentUserId();
      const addedPassword = await passwordService.addPassword(userId, newPassword);
      setPasswords([...passwords, addedPassword]);

      setNewPassword({
        description: "",
        username: "",
        value: "",
        website: "",
      });

      toast.success("Success", {
        description: "Password added successfully"
      });
    } catch (error) {
      console.error("Error adding password:", error);
      toast.error("Error", {
        description: error.message || "Failed to add password. Please try again later."
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const userId = getCurrentUserId();
      const updatedPassword = await passwordService.updatePassword(
        userId,
        editingPassword.id,
        editingPassword
      );

      setPasswords(
        passwords.map((p) => (p.id === updatedPassword.id ? updatedPassword : p))
      );

      setEditingPassword(null);

      toast.success("Success", {
        description: "Password updated successfully"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Error", {
        description: error.message || "Failed to update password. Please try again later."
      });
    }
  };

  const handleDeletePassword = async (id) => {
    try {
      const userId = getCurrentUserId();
      await passwordService.deletePassword(userId, id);

      setPasswords(passwords.filter((p) => p.id !== id));

      toast.success("Success", {
        description: "Password deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.error("Error", {
        description: error.message || "Failed to delete password. Please try again later."
      });
    }
  };

  const filteredPasswords = passwords.filter((password) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      password.username.toLowerCase().includes(searchLower) ||
      password.website?.toLowerCase().includes(searchLower)
    );
  });

  const startEditPassword = (password) => {
    setEditingPassword({ ...password });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">SecureIt</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Password</DialogTitle>
                <DialogDescription>
                  Add a new password to your vault. All data is encrypted.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPassword}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPassword.title}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, description: e.target.value })
                      }
                      placeholder="e.g., Gmail, Netflix"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username/Email</Label>
                    <Input
                      id="username"
                      value={newPassword.username}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, username: e.target.value })
                      }
                      placeholder="username or email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword.new ? "text" : "password"}
                        value={newPassword.password}
                        onChange={(e) =>
                          setNewPassword({ ...newPassword, value: e.target.value })
                        }
                        placeholder="Enter password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL (optional)</Label>
                    <Input
                      id="website"
                      value={newPassword.website}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, website: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Password</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredPasswords.length === 0 ? (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No passwords found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No passwords match your search. Try a different term."
                : "Add your first password to get started."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPasswords.map((password) => (
              <Card key={password.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{password.title}</CardTitle>
                  <CardDescription className="truncate">
                    {password.website || "No website URL"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="space-y-1">
                    <Label>Username</Label>
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate flex-1">
                        {password.username}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyToClipboard(password.username)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Password</Label>
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate flex-1">
                        {showPassword[password.id] ? password.value : "••••••••••••"}
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePasswordVisibility(password.id)}
                        >
                          {showPassword[password.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyToClipboard(password.password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between w-full">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditPassword(password)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Password</DialogTitle>
                          <DialogDescription>
                            Make changes to your saved password.
                          </DialogDescription>
                        </DialogHeader>
                        {editingPassword && (
                          <form onSubmit={handleUpdatePassword}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={editingPassword.title}
                                  onChange={(e) =>
                                    setEditingPassword({
                                      ...editingPassword,
                                      title: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-username">Username/Email</Label>
                                <Input
                                  id="edit-username"
                                  value={editingPassword.username}
                                  onChange={(e) =>
                                    setEditingPassword({
                                      ...editingPassword,
                                      username: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-password">Password</Label>
                                <div className="relative">
                                  <Input
                                    id="edit-password"
                                    type={showPassword.edit ? "text" : "password"}
                                    value={editingPassword.password}
                                    onChange={(e) =>
                                      setEditingPassword({
                                        ...editingPassword,
                                        password: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0"
                                    onClick={() => setShowPassword({ ...showPassword, edit: !showPassword.edit })}
                                  >
                                    {showPassword.edit ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-website">Website URL (optional)</Label>
                                <Input
                                  id="edit-website"
                                  value={editingPassword.website || ""}
                                  onChange={(e) =>
                                    setEditingPassword({
                                      ...editingPassword,
                                      website: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeletePassword(password.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}