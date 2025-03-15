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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          company: userData.company,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: userData.role,
        });

      if (roleError) throw roleError;

      // Update profile with company and phone
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company: userData.company,
          phone: userData.phone,
        })
        .eq('id', data.user.id);

      if (profileError) throw profileError;
    }

    return { data, error: null };
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
