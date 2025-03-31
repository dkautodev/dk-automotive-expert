
import { supabase } from "@/integrations/supabase/client";
import { ClientData, NewClientData } from "../types/clientTypes";
import { transformProfileToClient, transformUserToClient } from "../utils/clientTransformers";
import { toast } from "sonner";

/**
 * Fetches clients from the Supabase backend
 */
export const fetchClientsData = async (): Promise<{
  clients: ClientData[];
  error: string | null;
}> => {
  try {
    // Try Admin API first
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (!authError && authData?.users && authData.users.length > 0) {
      console.log("Utilisateurs récupérés via auth:", authData.users);
      
      // Get profiles to enrich user data
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (profilesError) {
        console.warn("Erreur lors de la récupération des profils:", profilesError);
      }
      
      // Transform auth users to client format
      const formattedClients: ClientData[] = authData.users
        .filter(user => 
          // Ensure user object has required properties
          user && typeof user === 'object' && 'id' in user
        )
        .map(user => transformUserToClient(user, profiles));
      
      return { clients: formattedClients, error: null };
    }
    
    // Fallback: try fetching from user_profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      throw profilesError;
    }
    
    if (!userProfiles || userProfiles.length === 0) {
      console.log("Aucun profil client trouvé dans la base de données");
      return { clients: [], error: null };
    }
    
    // Transform profiles to client format
    const formattedClients: ClientData[] = userProfiles.map(profile => 
      transformProfileToClient(profile)
    );
    
    return { clients: formattedClients, error: null };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des clients:', error);
    return { 
      clients: [], 
      error: error.message || 'Erreur lors du chargement des clients'
    };
  }
};

/**
 * Adds a new client to the system
 */
export const addClientData = async (newClientData: NewClientData): Promise<string | null> => {
  try {
    // Implement client addition logic here
    // This is currently a placeholder as in the original code
    return null;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du client:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout du client');
    return null;
  }
};
