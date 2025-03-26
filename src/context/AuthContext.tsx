
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole } from "@/hooks/auth/types";
import type { UserProfile } from "@/hooks/auth/types";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata: Record<string, any>) => Promise<any>;
  registerAdmin: (email: string, password: string) => Promise<any>;
  user: User | null;
  session: Session | null;
  error: string | null;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!auth.user,
      isLoading: auth.loading,
      profile: null,
      role: auth.role,
      user: auth.user,
      session: auth.session,
      error: auth.error,
      signIn: auth.signIn,
      signUp: auth.signUp,
      registerAdmin: auth.registerAdmin,
      signOut: auth.signOut,
      fetchUserProfile: auth.fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
