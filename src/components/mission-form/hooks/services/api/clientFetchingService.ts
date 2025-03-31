
import { supabase } from "@/integrations/supabase/client";
import { ClientData } from "../../types/clientTypes";
import { clientMappingService } from "../mappers/clientMappingService";
import { userDataService } from "./userDataService";

type FetchResult = {
  success: boolean;
  clients: ClientData[];
  error?: string;
};

/**
 * Client data fetching module
 */
export const clientFetchingService = {
  /**
   * Fetches clients via user profiles
   */
  fetchClientsViaProfiles: async (): Promise<FetchResult> => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
        return { success: false, clients: [], error: error.message };
      }

      // For each profile, fetch the corresponding user data
      const clients: ClientData[] = [];

      for (const profile of profiles || []) {
        // Skip profiles without a user_id
        if (!profile.user_id) continue;

        try {
          const userData = await userDataService.fetchUserById(profile.user_id);
          
          if (userData) {
            const client = clientMappingService.mapProfileToClient(profile, userData);
            clients.push(client);
          }
        } catch (err) {
          console.warn(`Error fetching user data for profile ${profile.user_id}:`, err);
          // Continue with other profiles even if one fails
        }
      }

      return { success: true, clients };
    } catch (error: any) {
      console.error("Error in fetchClientsViaProfiles:", error);
      return { success: false, clients: [], error: error.message };
    }
  },

  /**
   * Fetches clients via Edge Function
   */
  fetchClientsViaEdgeFunction: async (): Promise<FetchResult> => {
    try {
      const { data: usersData, error: usersError } = await supabase.functions.invoke<any[]>(
        'get_users_with_profiles'
      );
      
      if (usersError) {
        console.error("Error fetching users via Edge Function:", usersError);
        return { success: false, clients: [], error: usersError.message };
      }
      
      if (!usersData || !Array.isArray(usersData)) {
        console.warn("Invalid user data returned from Edge Function");
        return { success: false, clients: [], error: "Invalid data format" };
      }
      
      const clients: ClientData[] = usersData
        .filter(user => user)
        .map(userData => clientMappingService.mapUserToClient(userData));
      
      return { success: true, clients };
    } catch (error: any) {
      console.error("Error in fetchClientsViaEdgeFunction:", error);
      return { success: false, clients: [], error: error.message };
    }
  }
};
