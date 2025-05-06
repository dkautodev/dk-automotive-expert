
import { ClientData, NewClientData } from "../types/clientTypes";
import { clientFetchingService } from "./api/clientFetchingService";
import { clientCreationService } from "./operations/clientCreationService";

/**
 * Public API for client service
 */
export const clientService = {
  /**
   * Fetches clients from the Supabase backend
   */
  fetchClientsData: async (): Promise<{
    clients: ClientData[];
    error: string | null;
  }> => {
    try {
      console.log("Début de la récupération des clients depuis Supabase");
      
      // First try: Get users from the new unified_users table
      const profileResult = await clientFetchingService.fetchClientsViaUnifiedTable();
      
      if (profileResult.success && profileResult.clients.length > 0) {
        return { clients: profileResult.clients, error: null };
      }

      // Fallback: Try legacy methods
      const legacyProfileResult = await clientFetchingService.fetchClientsViaProfiles();
      
      if (legacyProfileResult.success && legacyProfileResult.clients.length > 0) {
        return { clients: legacyProfileResult.clients, error: null };
      }

      // Last resort: Try to get users via Edge Function
      const edgeFunctionResult = await clientFetchingService.fetchClientsViaEdgeFunction();
      
      if (edgeFunctionResult.success) {
        return { clients: edgeFunctionResult.clients, error: null };
      }

      console.log("Aucun client trouvé dans toutes les sources");
      return { clients: [], error: null };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des clients:', error);
      return { 
        clients: [], 
        error: error.message || 'Erreur lors du chargement des clients'
      };
    }
  },

  /**
   * Adds a new client to the system
   */
  addClientData: async (newClientData: NewClientData): Promise<string | null> => {
    return await clientCreationService.addClient(newClientData);
  }
};

// Export for backward compatibility
export const { fetchClientsData, addClientData } = clientService;
