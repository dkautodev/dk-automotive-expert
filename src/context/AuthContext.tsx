
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/hooks/auth/types';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export interface AuthContextValue {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('visitor');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Mock signIn:", { email, password });
    
    setUser({ id: "mock-user-id", email });
    setProfile({
      firstName: "John",
      lastName: "Doe",
      email: email,
      phone: "+33123456789",
      company: "Demo Company"
    });
    setRole('client');
  };

  const signOut = async () => {
    console.log("Mock signOut");
    
    setUser(null);
    setProfile(null);
    setRole('visitor');
  };

  const fetchUserProfile = async (userId: string) => {
    console.log("Mock fetchUserProfile:", userId);
    
    const mockProfile = {
      id: userId,
      first_name: "John",
      last_name: "Doe",
      email: "user@example.com",
      phone: "+33123456789",
      company: "Demo Company"
    };
    
    return mockProfile;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
