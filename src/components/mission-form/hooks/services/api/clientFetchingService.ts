import { supabase } from "@/integrations/supabase/client";
import { safeTable, safeDataAccess } from "@/utils/supabase-helper";
import { ClientData, UnifiedUserData } from "../../types/clientTypes";
import { clientMappingService } from "../mappers/clientMappingService";

/**
 * Service for fetching client data from different sources
 */
export const clientFetchingService = {
  /**
   * Fetch clients via the new unified_users table
   */
  fetchClientsViaUnifiedTable: async () => {
    try {
      // Get users from the unified table with explicit type casting
      const response = await safeTable("unified_users")
        .select("*")
        .eq("role", "client");

      const usersData = safeDataAccess(response, []);

      // Log for debugging
      console.log("Unified users retrieved:", usersData?.length || 0);

      // If no users, return empty array
      if (!usersData || usersData.length === 0) {
        return { success: true, clients: [] };
      }

      // Safe conversion using type assertion after validation
      const safeUsers = usersData.filter((user: any) => 
        user && typeof user.id === 'string' && typeof user.email === 'string'
      ) as UnifiedUserData[];
      
      // Transform users to client format
      const clients: ClientData[] = safeUsers.map((user) => {
        return {
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unnamed client',
          email: user.email,
          first_name: user.first_name || undefined,
          last_name: user.last_name || undefined,
          company: user.company_name || undefined,
          client_code: user.client_code || undefined,
          phone: user.phone || undefined
        };
      });

      return { success: true, clients };
    } catch (error) {
      console.error("Error fetching clients via unified table:", error);
      return { success: false, clients: [] };
    }
  },

  /**
   * Fetch clients via user profiles table
   */
  fetchClientsViaProfiles: async () => {
    try {
      // Get user profiles
      const response = await supabase
        .from("user_profiles")
        .select("*");

      const profiles = safeDataAccess(response, []);

      console.log("Profiles retrieved:", profiles?.length || 0);

      // If no profiles, return empty array
      if (!profiles || profiles.length === 0) {
        return { success: true, clients: [] };
      }

      // Transform profiles to client format
      const clients: ClientData[] = profiles.map((profile) => {
        return clientMappingService.mapProfileToClient(profile, { email: "" });
      });

      return { success: true, clients };
    } catch (error) {
      console.error("Error fetching clients via profiles:", error);
      return { success: false, clients: [] };
    }
  },

  /**
   * Fetch clients via edge function
   */
  fetchClientsViaEdgeFunction: async () => {
    try {
      const response = await supabase.functions.invoke("get_users_with_profiles");
      const data = safeDataAccess(response, []);

      console.log("Edge Function Data:", data?.length || 0);

      // Filter to keep only clients
      const clientUsers = Array.isArray(data)
        ? data.filter((user) => user.user_type === "client")
        : [];

      // Transform data to ClientData format
      const clients: ClientData[] = clientUsers.map(clientMappingService.mapUserToClient);

      return { success: true, clients };
    } catch (error) {
      console.error("Error fetching clients via Edge Function:", error);
      return { success: false, clients: [] };
    }
  }
};
