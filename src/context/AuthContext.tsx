
import React, { createContext, useContext } from 'react';

type UserProfile = {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
};

export interface AuthContextValue {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultContext: AuthContextValue = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  role: null,
  signIn: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthContext.Provider value={defaultContext}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
