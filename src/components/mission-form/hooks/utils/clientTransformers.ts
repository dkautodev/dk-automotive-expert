
import { ClientData } from "../types/clientTypes";

/**
 * Transforms user profile data into standardized client format
 */
export const transformProfileToClient = (profile: any): ClientData => {
  const fullName = [
    profile.first_name || '',
    profile.last_name || ''
  ].filter(Boolean).join(' ');

  return {
    id: profile.user_id || profile.id || '',
    name: fullName.trim() || 'Client sans nom',
    email: profile.email || '', // Profile might not have email
    phone: profile.phone || '',
    company: profile.company_name || '',
    address: profile.billing_address || ''
  };
};

/**
 * Transforms auth user data with optional profile into standardized client format
 */
export const transformUserToClient = (user: any, profiles?: any[]): ClientData => {
  if (!user) {
    console.warn("Utilisateur invalide reçu dans transformUserToClient");
    return {
      id: '',
      name: 'Client invalide',
      email: '',
    };
  }

  // Find matching profile if profiles are provided
  const profile = profiles?.find(p => p?.user_id === user.id);
  
  // Extract name components from profile or user metadata
  let firstName = '', lastName = '', company = '', phone = '';
  
  if (profile) {
    firstName = profile.first_name || '';
    lastName = profile.last_name || '';
    company = profile.company_name || '';
    phone = profile.phone || '';
  } else if (user.user_metadata) {
    firstName = user.user_metadata.firstName || user.user_metadata.first_name || '';
    lastName = user.user_metadata.lastName || user.user_metadata.last_name || '';
    company = user.user_metadata.company || '';
    phone = user.user_metadata.phone || '';
  }
  
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  
  // Ensure email is a string
  const userEmail = user.email && typeof user.email === 'string' ? user.email : '';
  
  // Set a default name if none is available
  const finalName = fullName.trim() || userEmail || 'Client sans nom';
  
  return {
    id: user.id || '',
    name: finalName,
    email: userEmail,
    phone: phone,
    company: company,
    address: profile?.billing_address || ''
  };
};
