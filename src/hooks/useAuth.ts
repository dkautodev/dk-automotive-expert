
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export type UserRole = 'client' | 'driver' | 'admin';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const { data: role } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .rpc('get_user_role', { user_id: user.id });

      if (error) throw error;
      return data as UserRole;
    },
    enabled: !!user?.id,
  });

  const signUp = async (email: string, password: string, userData: { 
    first_name: string;
    last_name: string;
    phone?: string;
    company?: string;
    role: UserRole;
  }) => {
    try {
      // 1. Create the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            company: userData.company
          }
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        return { data: null, error: signUpError };
      }

      if (!signUpData.user) {
        console.error("No user data after signup");
        return { data: null, error: new Error("Failed to create user") };
      }

      console.log("User created successfully:", signUpData.user.id);

      // 2. Wait a bit longer for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Try to create the user role
      try {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: signUpData.user.id,
            role: userData.role
          });

        if (roleError) {
          console.error("Role assignment error:", roleError);
          throw roleError;
        }

        console.log("Role assigned successfully");
        return { data: signUpData, error: null };
      } catch (roleError) {
        console.error("Failed to assign role:", roleError);
        return { data: null, error: roleError };
      }
    } catch (error) {
      console.error("Global signup error:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    profile,
    role,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isLoading: !user && !profile,
  };
};
