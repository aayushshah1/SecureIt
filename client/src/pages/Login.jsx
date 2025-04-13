import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use the login function from AuthContext
      await login(email, password);
      
      // Navigate to the dashboard on success
      navigate("/dashboard");
    } catch (err) {
      // Error handling is done inside AuthContext
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">SecureIt</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your passwords
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}