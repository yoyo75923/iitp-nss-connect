
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }
    
    // Validate email format
    if (!email.endsWith('@iitp.ac.in')) {
      toast.error("Only @iitp.ac.in email addresses are allowed");
      return;
    }
    
    if (!password) {
      toast.error("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        toast.error("Login failed. Please check your credentials.");
      }
      // If success, navigation handled by the effect above
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">NSS Portal Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the NSS Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email (only @iitp.ac.in)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your roll number as password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-nss-primary hover:bg-nss-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Login Information:</h3>
            <ul className="text-xs space-y-1 text-blue-800">
              <li>Username: Your @iitp.ac.in email</li>
              <li>Password: Your roll number (e.g., 2001CS11)</li>
              <li>Example: Email: pranaviyer@iitp.ac.in | Password: 2001CS11</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
