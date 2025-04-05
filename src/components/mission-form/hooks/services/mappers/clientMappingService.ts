
import { ClientData } from "../../types/clientTypes";

/**
 * Client data mapping module
 */
export const clientMappingService = {
  /**
   * Maps a user profile and auth data to the ClientData format
   */
  mapProfileToClient: (profile: any, userData: any): ClientData => {
    const fullName = [
      profile.first_name || userData?.first_name || '',
      profile.last_name || userData?.last_name || ''
    ].filter(Boolean).join(' ');
    
    return {
      id: profile.user_id,
      name: fullName || userData?.email || 'Client sans nom',
      email: userData?.email || '',
      phone: profile.phone || '',
      company: profile.company_name || '',
      address: profile.billing_address || '',
      first_name: profile.first_name || userData?.first_name || '',
      last_name: profile.last_name || userData?.last_name || '',
      client_code: profile.client_code || ''
    };
  },

  /**
   * Maps user data from the Edge Function to ClientData format
   */
  mapUserToClient: (userData: any): ClientData => {
    const fullName = [
      userData.first_name || '',
      userData.last_name || ''
    ].filter(Boolean).join(' ');
    
    return {
      id: userData.id,
      name: fullName || userData.email || 'Client sans nom',
      email: userData.email || '',
      phone: userData.phone || '',
      company: userData.company_name || '',
      address: '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      client_code: userData.client_code || ''
    };
  }
};
