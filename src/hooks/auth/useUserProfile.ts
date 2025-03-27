
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

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

      // Extraire l'email de la relation users
      const userEmail = profileData.users ? (profileData.users as any).email : '';

      // Check if the database has the locked fields columns
      // If not, we need to handle it gracefully
      const siretLocked = 'siret_locked' in profileData ? !!profileData.siret_locked : false;
      const vatNumberLocked = 'vat_number_locked' in profileData ? !!profileData.vat_number_locked : false;

      console.log("Profile data from DB:", profileData);

      // Mapper les données au format UserProfile
      return {
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: userEmail,
        phone: profileData.phone,
        company: profileData.company_name,
        profile_picture: profileData.profile_picture,
        siret: profileData.siret_number,
        vat_number: profileData.vat_number,
        siret_locked: siretLocked,
        vat_number_locked: vatNumberLocked,
        billing_address: profileData.billing_address
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return { fetchUserProfile };
};
