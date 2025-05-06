
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, mapDatabaseProfileToUserProfile } from '@/hooks/auth/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  role: UserRole | null;
  profile: UserProfile | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      const userProfile = mapDatabaseProfileToUserProfile(data);
      setProfile(userProfile);
      setRole(data.role);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    // First, set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);

      if (session?.user) {
        fetchProfile();
      } else {
        setProfile(null);
        setRole(null);
      }
      
      setIsLoading(false);
    });

    // Then, get the initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setIsAuthenticated(!!session);

        if (session?.user) {
          await fetchProfile();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'client',
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        role,
        profile,
        error,
        signIn,
        signUp,
        signOut,
        fetchProfile,
      }}
    >
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
