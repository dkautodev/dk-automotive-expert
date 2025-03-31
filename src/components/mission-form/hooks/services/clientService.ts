
import { supabase } from "@/integrations/supabase/client";
import { ClientData, NewClientData } from "../types/clientTypes";
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
    
    // First try: Get user profiles and map them to clients
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', 'client');
      
    if (profilesError) {
      console.error("Erreur lors de la récupération des profils:", profilesError);
      throw profilesError;
    }

    console.log("Profils récupérés:", profilesData);
    
    if (profilesData && profilesData.length > 0) {
      // Get user emails from auth
      const userIds = profilesData.map(profile => profile.user_id);
      
      // Initialize clients with profile data
      const clients: ClientData[] = [];
      
      // Process each profile to get complete client data
      for (const profile of profilesData) {
        try {
          // Get user data from Edge Function
          const { data: userData, error: userError } = await supabase.functions.invoke<any>(
            'get_user_by_id',
            {
              body: { userId: profile.user_id }
            }
          );
          
          if (userError) {
            console.warn(`Erreur lors de la récupération des données pour l'utilisateur ${profile.user_id}:`, userError);
            continue;
          }
          
          if (userData) {
            const fullName = [
              profile.first_name || userData.first_name || '',
              profile.last_name || userData.last_name || ''
            ].filter(Boolean).join(' ');
            
            clients.push({
              id: profile.user_id,
              name: fullName || userData.email || 'Client sans nom',
              email: userData.email || '',
              phone: profile.phone || '',
              company: profile.company_name || '',
              address: profile.billing_address || ''
            });
          }
        } catch (error) {
          console.error(`Erreur pour l'utilisateur ${profile.user_id}:`, error);
        }
      }
      
      console.log("Clients formatés depuis user_profiles:", clients);
      return { clients, error: null };
    }

    // Fallback: Try to get users directly (without profiles)
    console.log("Aucun profil trouvé, essai avec l'Edge Function");
    try {
      const { data: usersData, error: edgeFunctionError } = await supabase.functions.invoke<any>(
        'get_users_with_profiles'
      );
      
      if (edgeFunctionError) {
        console.error("Erreur Edge Function:", edgeFunctionError);
        throw edgeFunctionError;
      }
      
      console.log("Données récupérées via Edge Function:", usersData);
      
      if (usersData && usersData.length > 0) {
        // Filter for clients only if user_type is available
        const clientUsers = usersData.filter((user: any) => 
          !user.user_type || user.user_type === 'client'
        );
        
        // Transform the data into ClientData format
        const formattedClients = clientUsers.map((userData: any) => {
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
    
    // Create user in auth if email is provided
    if (newClientData.email) {
      // Generate a random password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newClientData.email,
        password: tempPassword,
        email_confirm: true
      });
      
      if (authError) {
        console.error("Erreur lors de la création de l'utilisateur:", authError);
        throw authError;
      }
      
      if (authData?.user) {
        // Create profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            first_name: newClientData.first_name,
            last_name: newClientData.last_name,
            phone: newClientData.phone,
            company_name: newClientData.company,
            billing_address: newClientData.address,
            user_type: 'client'
          })
          .select();
        
        if (profileError) {
          console.error("Erreur lors de l'ajout du profil:", profileError);
          throw profileError;
        }
        
        console.log("Utilisateur et profil client créés avec succès");
        return authData.user.id;
      }
    } else {
      // Just create a profile without auth user
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          first_name: newClientData.first_name,
          last_name: newClientData.last_name,
          phone: newClientData.phone,
          company_name: newClientData.company,
          billing_address: newClientData.address,
          user_type: 'client'
        })
        .select();
      
      if (profileError) {
        console.error("Erreur lors de l'ajout du profil:", profileError);
        throw profileError;
      }
      
      console.log("Profil client créé avec succès:", profileData);
      return profileData[0].id;
    }
    
    return null;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du client:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout du client');
    return null;
  }
};
