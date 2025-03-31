
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
    console.log("Début de la récupération des clients depuis Supabase");
    
    // Récupérer d'abord les profils utilisateurs depuis user_profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
      
    if (profilesError) {
      console.error("Erreur lors de la récupération des profils:", profilesError);
      throw profilesError;
    }

    console.log("Profils récupérés:", profilesData);
    
    if (profilesData && profilesData.length > 0) {
      // Transformer les profils en format ClientData
      const formattedClients = profilesData.map(profile => {
        const fullName = [
          profile.first_name || '',
          profile.last_name || ''
        ].filter(Boolean).join(' ');
        
        return {
          id: profile.user_id || profile.id,
          name: fullName || profile.company_name || 'Client sans nom',
          email: '',  // Les profils n'ont pas d'email directement
          phone: profile.phone || '',
          company: profile.company_name || '',
          address: profile.billing_address || ''
        };
      });
      
      console.log("Clients formatés depuis user_profiles:", formattedClients);
      return { clients: formattedClients, error: null };
    }

    // Si aucun profil n'est trouvé, essayer avec la table users
    console.log("Aucun profil trouvé, essai avec la table users");
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      throw usersError;
    }

    console.log("Utilisateurs récupérés:", usersData);

    if (usersData && usersData.length > 0) {
      // Transformer les utilisateurs en format ClientData
      const formattedClients = usersData.map(user => ({
        id: user.id,
        name: user.email || 'Client sans nom',
        email: user.email || '',
        phone: '',
        company: ''
      }));

      console.log("Clients formatés depuis users:", formattedClients);
      return { clients: formattedClients, error: null };
    }

    // Dernier recours: essayer de récupérer directement les utilisateurs via l'API Edge Function
    try {
      console.log("Tentative de récupération via Edge Function");
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('get_users_with_profiles');
      
      if (edgeFunctionError) {
        console.error("Erreur Edge Function:", edgeFunctionError);
        throw edgeFunctionError;
      }
      
      console.log("Données récupérées via Edge Function:", edgeFunctionData);
      
      if (edgeFunctionData && edgeFunctionData.length > 0) {
        // Transformer les données en format ClientData
        const formattedClients = edgeFunctionData.map((userData: any) => {
          const fullName = [
            userData.first_name || '',
            userData.last_name || ''
          ].filter(Boolean).join(' ');
          
          return {
            id: userData.id,
            name: fullName || userData.email || 'Client sans nom',
            email: userData.email || '',
            phone: userData.phone || '',
            company: userData.company_name || ''
          };
        });
        
        console.log("Clients formatés depuis Edge Function:", formattedClients);
        return { clients: formattedClients, error: null };
      }
    } catch (edgeFnError) {
      console.warn("Erreur lors de l'appel à l'Edge Function:", edgeFnError);
      // Continue to fallback
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
};

/**
 * Adds a new client to the system
 */
export const addClientData = async (newClientData: NewClientData): Promise<string | null> => {
  try {
    console.log("Tentative d'ajout d'un nouveau client:", newClientData);
    
    // Création du profil utilisateur dans user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        first_name: newClientData.first_name,
        last_name: newClientData.last_name,
        phone: newClientData.phone,
        company_name: newClientData.company,
        billing_address: newClientData.address
      })
      .select();
    
    if (profileError) {
      console.error("Erreur lors de l'ajout du profil:", profileError);
      throw profileError;
    }

    console.log("Profil client créé avec succès:", profileData);
    return profileData[0].id;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du client:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout du client');
    return null;
  }
};
