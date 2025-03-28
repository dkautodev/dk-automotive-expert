
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { mapDatabaseProfileToUserProfile } from './helpers/profileMapper';

export const useUserProfile = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Récupérer le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      console.log("Profile data from DB:", profileData);

      // Récupérer l'email de l'utilisateur depuis auth
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email || '';

      // Combiner les informations du profil avec l'email
      const completeProfile = {
        ...profileData,
        email
      };

      // Map database profile to UserProfile format
      return mapDatabaseProfileToUserProfile(completeProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return { fetchUserProfile };
};
