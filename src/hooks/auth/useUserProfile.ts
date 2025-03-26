
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useUserProfile = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, users(email)')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    const userEmail = (profileData.users as { email: string })?.email || '';

    return {
      ...profileData,
      email: userEmail,
      company: profileData.company_name,
      siret: profileData.siret_number,
      siret_locked: false,
      vat_number_locked: false
    };
  };

  return { fetchUserProfile };
};
