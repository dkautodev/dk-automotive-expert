
import { supabase } from "@/integrations/supabase/client";
import { FetchUsersResponse } from "../../types/clientManagementTypes";

/**
 * Edge function module for user data fetching
 */
export const edgeFunctionService = {
  /**
   * Fetches users with profiles via edge function
   */
  fetchUsersViaEdgeFunction: async (): Promise<FetchUsersResponse | null> => {
    try {
      const { data: usersData, error: usersError } = await supabase.functions.invoke<any[]>('get_users_with_profiles');

      if (usersError) {
        console.warn("Erreur avec l'edge function:", usersError);
        return null;
      }
      
      if (!usersData || usersData.length === 0) {
        console.warn("Pas de données de l'Edge Function");
        return null;
      }
      
      console.log("Utilisateurs récupérés via Edge Function:", usersData);
      
      // Filter by user type
      const clientsList = usersData.filter(user => user.user_type === 'client');
      const driversList = usersData.filter(user => user.user_type === 'chauffeur');
      const adminsList = usersData.filter(user => user.user_type === 'admin');
      
      return { clients: clientsList, drivers: driversList, admins: adminsList };
    } catch (edgeFnError) {
      console.warn("Erreur lors de l'appel à l'Edge Function:", edgeFnError);
      return null;
    }
  }
};
