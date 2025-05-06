
import { supabase } from "@/integrations/supabase/client";
import { safeTable } from "@/utils/supabase-helper";
import { ClientData } from "../../types/clientTypes";
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
      // Récupérer les utilisateurs depuis la table unifiée
      const { data: users, error: usersError } = await supabase
        .from("unified_users")
        .select("*")
        .eq("role", "client");

      if (usersError) {
        console.error("Erreur lors de la récupération des utilisateurs unifiés:", usersError);
        return { success: false, clients: [] };
      }

      console.log("Utilisateurs unifiés récupérés:", users?.length || 0);

      // Si pas d'utilisateurs, retourner un tableau vide
      if (!users || users.length === 0) {
        return { success: true, clients: [] };
      }

      // Transformation des utilisateurs en format client
      const clients: ClientData[] = users.map((user) => {
        return {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          company: user.company_name,
          client_code: user.client_code,
          phone: user.phone
        };
      });

      return { success: true, clients };
    } catch (error) {
      console.error("Erreur lors de la récupération des clients via table unifiée:", error);
      return { success: false, clients: [] };
    }
  },

  /**
   * Fetch clients via user profiles table
   */
  fetchClientsViaProfiles: async () => {
    try {
      // Récupérer les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*");

      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
        return { success: false, clients: [] };
      }

      console.log("Profils récupérés:", profiles?.length || 0);

      // Si pas de profils, retourner un tableau vide
      if (!profiles || profiles.length === 0) {
        return { success: true, clients: [] };
      }

      // Transformation des profils en format client
      const clients: ClientData[] = profiles.map((profile) => {
        return clientMappingService.mapProfileToClient(profile, { email: "" });
      });

      return { success: true, clients };
    } catch (error) {
      console.error("Erreur lors de la récupération des clients via profils:", error);
      return { success: false, clients: [] };
    }
  },

  /**
   * Fetch clients via edge function
   */
  fetchClientsViaEdgeFunction: async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get_users_with_profiles");

      if (error) {
        console.error("Erreur Edge Function:", error);
        return { success: false, clients: [] };
      }

      console.log("Données de l'Edge Function:", data?.length || 0);

      // Filtrer pour ne garder que les clients
      const clientUsers = Array.isArray(data)
        ? data.filter((user) => user.user_type === "client")
        : [];

      // Transformer les données en format ClientData
      const clients: ClientData[] = clientUsers.map(clientMappingService.mapUserToClient);

      return { success: true, clients };
    } catch (error) {
      console.error("Erreur lors de la récupération des clients via Edge Function:", error);
      return { success: false, clients: [] };
    }
  }
};
