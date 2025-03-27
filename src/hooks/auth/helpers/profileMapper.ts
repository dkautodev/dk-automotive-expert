
import { UserProfile } from '../types';

/**
 * Maps database profile data to UserProfile format
 */
export const mapDatabaseProfileToUserProfile = (profileData: any): UserProfile => {
  // Check if the database has the locked fields columns
  // If not, we need to handle it gracefully
  const siretLocked = 'siret_locked' in profileData 
    ? !!profileData.siret_locked 
    : ('siret_number_locked' in profileData ? !!profileData.siret_number_locked : false);

  const vatNumberLocked = 'vat_number_locked' in profileData 
    ? !!profileData.vat_number_locked 
    : false;
  
  // Extract the email from the relation users
  const userEmail = profileData.users ? (profileData.users as any).email : '';
  
  // Map the data to UserProfile format
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
};
