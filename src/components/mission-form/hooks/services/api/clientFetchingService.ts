
import { supabase } from "@/integrations/supabase/client";
import { ClientData } from "../../types/clientTypes";
import { userDataService } from "./userDataService";
import { clientMappingService } from "../mappers/clientMappingService";

// Define interface for fetch result to avoid excessive type instantiation
export interface FetchClientResult {
  clients: ClientData[];
  success: boolean;
}

/**
 * Client data fetching strategies
 */
export const clientFetchingService = {
  /**
   * Fetches clients via user profiles
   */
  fetchClientsViaProfiles: async (): Promise<FetchClientResult> => {
    try {
      // Get user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_type', 'client');
        
      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
        throw profilesError;
      }

      console.log("Profils récupérés:", profilesData);
      
      if (!profilesData || profilesData.length === 0) {
        return { clients: [], success: false };
      }
      
      // Process each profile to get complete client data
      const clients: ClientData[] = [];
      
      for (const profile of profilesData) {
        const userData = await userDataService.fetchUserById(profile.user_id);
        if (userData) {
          clients.push(clientMappingService.mapProfileToClient(profile, userData));
        }
      }
      
      console.log("Clients formatés depuis user_profiles:", clients);
      return { clients, success: true };
    } catch (error) {
      console.error("Erreur lors de la récupération via profils:", error);
      return { clients: [], success: false };
    }
  },

  /**
   * Fetches clients via Edge Function as fallback
   */
  fetchClientsViaEdgeFunction: async (): Promise<FetchClientResult> => {
    try {
      console.log("Essai avec l'Edge Function");
      
      const { data: usersData, error: edgeFunctionError } = await supabase.functions.invoke<any[]>(
        'get_users_with_profiles'
      );
      
      if (edgeFunctionError) {
        console.error("Erreur Edge Function:", edgeFunctionError);
        throw edgeFunctionError;
      }
      
      console.log("Données récupérées via Edge Function:", usersData);
      
      if (!usersData || usersData.length === 0) {
        return { clients: [], success: false };
      }
      
      // Filter for clients only if user_type is available
      const clientUsers = usersData.filter((user: any) => 
        !user.user_type || user.user_type === 'client'
      );
      
      // Transform the data into ClientData format
      const clients = clientUsers.map((userData: any) => 
        clientMappingService.mapUserToClient(userData)
      );
      
      console.log("Clients formatés depuis Edge Function:", clients);
      return { clients, success: true };
    } catch (error) {
      console.warn("Erreur lors de l'appel à l'Edge Function:", error);
      return { clients: [], success: false };
    }
  }
};
