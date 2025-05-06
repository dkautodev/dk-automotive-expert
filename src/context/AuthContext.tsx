
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { AuthState, UserProfile } from '@/hooks/auth/types';

interface AuthContextValue extends AuthState {
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  role?: string;
  fetchProfile: () => Promise<void>; // Add missing fetchProfile method
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={{
      ...auth, 
      signOut: auth.signOut, 
      signIn: auth.signIn, 
      role: auth.profile?.role,
      fetchProfile: auth.fetchProfile || (async () => {}) // Provide a fallback implementation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
