
import { supabase } from "@/integrations/supabase/client";
import { ClientData, NewClientData } from "../types/clientTypes";
import { toast } from "sonner";

/**
 * Fetches user data from Edge Function by user ID
 */
const fetchUserById = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.functions.invoke<any>(
      'get_user_by_id',
      { body: { userId } }
    );
    
    if (userError) {
      console.warn(`Erreur lors de la récupération des données pour l'utilisateur ${userId}:`, userError);
      return null;
    }
    
    return userData;
  } catch (error) {
    console.error(`Erreur pour l'utilisateur ${userId}:`, error);
    return null;
  }
};

/**
 * Maps a user profile and auth data to the ClientData format
 */
const mapProfileToClient = (profile: any, userData: any): ClientData => {
  const fullName = [
    profile.first_name || userData?.first_name || '',
    profile.last_name || userData?.last_name || ''
  ].filter(Boolean).join(' ');
  
  return {
    id: profile.user_id,
    name: fullName || userData?.email || 'Client sans nom',
    email: userData?.email || '',
    phone: profile.phone || '',
    company: profile.company_name || '',
    address: profile.billing_address || ''
  };
};

/**
 * Maps user data from the Edge Function to ClientData format
 */
const mapUserToClient = (userData: any): ClientData => {
  const fullName = [
    userData.first_name || '',
    userData.last_name || ''
  ].filter(Boolean).join(' ');
  
  return {
    id: userData.id,
    name: fullName || userData.email || 'Client sans nom',
    email: userData.email || '',
    phone: userData.phone || '',
    company: userData.company_name || '',
    address: ''
  };
};

/**
 * Fetches clients via user profiles
 */
const fetchClientsViaProfiles = async (): Promise<{
  clients: ClientData[];
  success: boolean;
}> => {
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
      const userData = await fetchUserById(profile.user_id);
      if (userData) {
        clients.push(mapProfileToClient(profile, userData));
      }
    }
    
    console.log("Clients formatés depuis user_profiles:", clients);
    return { clients, success: true };
  } catch (error) {
    console.error("Erreur lors de la récupération via profils:", error);
    return { clients: [], success: false };
  }
};

/**
 * Fetches clients via Edge Function as fallback
 */
const fetchClientsViaEdgeFunction = async (): Promise<{
  clients: ClientData[];
  success: boolean;
}> => {
  try {
    console.log("Essai avec l'Edge Function");
    
    const { data: usersData, error: edgeFunctionError } = await supabase.functions.invoke<any>(
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
    const clients = clientUsers.map((userData: any) => mapUserToClient(userData));
    
    console.log("Clients formatés depuis Edge Function:", clients);
    return { clients, success: true };
  } catch (error) {
    console.warn("Erreur lors de l'appel à l'Edge Function:", error);
    return { clients: [], success: false };
  }
};

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
    const profileResult = await fetchClientsViaProfiles();
    
    if (profileResult.success && profileResult.clients.length > 0) {
      return { clients: profileResult.clients, error: null };
    }

    // Fallback: Try to get users directly (without profiles)
    const edgeFunctionResult = await fetchClientsViaEdgeFunction();
    
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
};

/**
 * Creates a user in auth and profile tables
 */
const createUserWithProfile = async (newClientData: NewClientData): Promise<string | null> => {
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
  
  return null;
};

/**
 * Creates a profile without auth user
 */
const createProfileOnly = async (newClientData: NewClientData): Promise<string | null> => {
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
};

/**
 * Adds a new client to the system
 */
export const addClientData = async (newClientData: NewClientData): Promise<string | null> => {
  try {
    console.log("Tentative d'ajout d'un nouveau client:", newClientData);
    
    // Create user in auth if email is provided
    if (newClientData.email) {
      return await createUserWithProfile(newClientData);
    } else {
      // Just create a profile without auth user
      return await createProfileOnly(newClientData);
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du client:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout du client');
    return null;
  }
};
