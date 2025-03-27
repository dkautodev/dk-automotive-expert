
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { mapDatabaseProfileToUserProfile } from './helpers/profileMapper';

export const useUserProfile = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Récupérer le profil utilisateur avec la relation à users
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, users(email)')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      console.log("Profile data from DB:", profileData);

      // Map database profile to UserProfile format
      return mapDatabaseProfileToUserProfile(profileData);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return { fetchUserProfile };
};
