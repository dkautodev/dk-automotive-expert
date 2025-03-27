
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // Fetch user profile when user is authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      if (auth.user?.id) {
        setProfileLoading(true);
        try {
          const userProfile = await auth.fetchUserProfile(auth.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error loading user profile:", error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfile(null);
      }
    };

    loadUserProfile();
  }, [auth.user?.id]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!auth.user,
      isLoading: auth.loading || profileLoading,
      profile,
      role: auth.role,
      user: auth.user,
      session: auth.session,
      error: auth.error,
      signIn: auth.signIn,
      signUp: auth.signUp,
      registerAdmin: auth.registerAdmin,
      signOut: async () => {
        await auth.signOut();
        setProfile(null);
        return Promise.resolve();
      },
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
