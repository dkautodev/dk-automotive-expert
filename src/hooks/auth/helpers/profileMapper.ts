
import { UserProfile } from '../types';

export const mapDatabaseProfileToUserProfile = (profileData: any): UserProfile | null => {
  if (!profileData) return null;

  // Parse billing address into components
  let billingAddress = profileData.billing_address || '';
  
  return {
    id: profileData.id || profileData.user_id,
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    company: profileData.company_name || '',
    profile_picture: profileData.profile_picture || '',
    siret: profileData.siret_number || '',
    vat_number: profileData.vat_number || '',
    siret_locked: profileData.siret_locked || false,
    vat_number_locked: profileData.vat_number_locked || false,
    billing_address: billingAddress
  };
};
