import React, { createContext, useContext, useState } from 'react';

// Define the User type
interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

// Define the context state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, role?: 'admin' | 'user') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Failed to parse stored user", error);
        }
    }
    return null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('auth_user'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state if needed or just rely on localStorage for initial


  const login = async (username: string, role: 'admin' | 'user' = 'user') => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      role, // Default to user, but allow admin for testing
      name: username.charAt(0).toUpperCase() + username.slice(1),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
