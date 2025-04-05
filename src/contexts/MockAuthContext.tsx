
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { toast } from '@/components/ui/use-toast';

// Mock data for users
const MOCK_USERS = [
  {
    id: 'vol1',
    name: 'John Doe',
    email: 'volunteer@iitp.ac.in',
    role: 'volunteer' as UserRole,
    rollNumber: '2023CS01',
    wing: 'Technical',
    mentor: 'Dr. Jane Smith'
  },
  {
    id: 'men1',
    name: 'Dr. Jane Smith',
    email: 'mentor@iitp.ac.in',
    role: 'mentor' as UserRole,
    wing: 'Technical',
    volunteers: ['vol1', 'vol3']
  },
  {
    id: 'sec1',
    name: 'Rajesh Kumar',
    email: 'secretary@iitp.ac.in',
    role: 'secretary' as UserRole,
    wing: 'All'
  },
  {
    id: 'vol3',
    name: 'Amit Singh',
    email: 'amit@iitp.ac.in',
    role: 'volunteer' as UserRole,
    rollNumber: '2023EC05',
    wing: 'Technical',
    mentor: 'Dr. Jane Smith'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('nss_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we accept any password
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('nss_user', JSON.stringify(foundUser));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('nss_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default MockAuthProvider;
