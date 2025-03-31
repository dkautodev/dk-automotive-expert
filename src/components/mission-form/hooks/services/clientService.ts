
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
      
      // First try: Get user profiles and map them to clients
      const profileResult = await clientFetchingService.fetchClientsViaProfiles();
      
      if (profileResult.success && profileResult.clients.length > 0) {
        return { clients: profileResult.clients, error: null };
      }

      // Fallback: Try to get users directly (without profiles)
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
