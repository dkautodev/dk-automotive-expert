
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { AuthState, UserProfile } from '@/hooks/auth/types';

interface AuthContextValue extends AuthState {
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  role?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={{...auth, signOut: auth.signOut, role: auth.profile?.role}}>
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
