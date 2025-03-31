
import { supabase } from "@/integrations/supabase/client";
import { FetchUsersResponse } from "../../types/clientManagementTypes";

/**
 * Auth API module for user data fetching
 */
export const authApiService = {
  /**
   * Fetches users via Supabase Auth API
   */
  fetchUsersViaAuthApi: async (): Promise<FetchUsersResponse | null> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError || !authData?.users) {
        console.warn("Erreur avec l'Auth API:", authError);
        return null;
      }
      
      console.log("Utilisateurs récupérés via Auth API:", authData.users);
      
      // Fetch user profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (profilesError) {
        console.warn("Erreur lors de la récupération des profils:", profilesError);
      }
      
      // Transform and combine data
      const allUsers = authData.users.map(user => {
        const profile = profilesData?.find(p => p.user_id === user.id);
        const userType = user.user_metadata?.role || user.user_metadata?.user_type || 'client';
        
        return {
          id: user.id,
          email: user.email || '',
          user_type: userType,
          first_name: profile?.first_name || user.user_metadata?.first_name || user.user_metadata?.firstName || '',
          last_name: profile?.last_name || user.user_metadata?.last_name || user.user_metadata?.lastName || '',
          company_name: profile?.company_name || user.user_metadata?.company || '',
          phone: profile?.phone || user.user_metadata?.phone || '',
          created_at: user.created_at
        };
      });
      
      // Detect admin email if necessary
      const adminUsers = allUsers.map(user => {
        if (user.email === 'dkautomotive70@gmail.com' && user.user_type !== 'admin') {
          return { ...user, user_type: 'admin' };
        }
        return user;
      });
      
      // Filter by user type
      const clientsList = adminUsers.filter(user => user.user_type === 'client');
      const driversList = adminUsers.filter(user => user.user_type === 'chauffeur');
      const adminsList = adminUsers.filter(user => user.user_type === 'admin');
      
      return { clients: clientsList, drivers: driversList, admins: adminsList };
    } catch (authApiError) {
      console.warn("Erreur lors de l'appel à l'Auth API:", authApiError);
      return null;
    }
  }
};
