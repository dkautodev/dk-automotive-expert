
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "../types";
import { FetchUsersResponse } from "../types/clientManagementTypes";

/**
 * Fetches users with their profiles from various sources
 */
export const fetchUsersWithProfiles = async (): Promise<FetchUsersResponse> => {
  // Try with Edge Function first
  try {
    const { data: usersData, error: usersError } = await supabase.functions.invoke('get_users_with_profiles');

    if (!usersError && usersData && usersData.length > 0) {
      console.log("Utilisateurs récupérés via Edge Function:", usersData);
      
      // Filter by user type
      const clientsList = usersData.filter(user => user.user_type === 'client');
      const driversList = usersData.filter(user => user.user_type === 'chauffeur');
      const adminsList = usersData.filter(user => user.user_type === 'admin');
      
      return { clients: clientsList, drivers: driversList, admins: adminsList };
    } else {
      console.warn("Pas de données de l'Edge Function ou erreur:", usersError);
    }
  } catch (edgeFnError) {
    console.warn("Erreur lors de l'appel à l'Edge Function:", edgeFnError);
  }

  // Fallback: Auth API
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (!authError && authData && authData.users) {
      console.log("Utilisateurs récupérés via Auth API:", authData.users);
      
      // Fetch user profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (profilesError) {
        console.warn("Erreur lors de la récupération des profils:", profilesError);
      }
      
      // Transform and combine data
      const allUsers = authData.users.map(user => {
        const profile = profilesData?.find(p => p.user_id === user.id);
        const userType = user.user_metadata?.role || user.user_metadata?.user_type || 'client';
        
        return {
          id: user.id,
          email: user.email || '',
          user_type: userType,
          first_name: profile?.first_name || user.user_metadata?.first_name || user.user_metadata?.firstName || '',
          last_name: profile?.last_name || user.user_metadata?.last_name || user.user_metadata?.lastName || '',
          company_name: profile?.company_name || user.user_metadata?.company || '',
          phone: profile?.phone || user.user_metadata?.phone || '',
          created_at: user.created_at
        };
      });
      
      // Détecter l'administrateur par email si nécessaire
      const adminUsers = allUsers.map(user => {
        if (user.email === 'dkautomotive70@gmail.com' && user.user_type !== 'admin') {
          return { ...user, user_type: 'admin' };
        }
        return user;
      });
      
      // Filter by user type
      const clientsList = adminUsers.filter(user => user.user_type === 'client');
      const driversList = adminUsers.filter(user => user.user_type === 'chauffeur');
      const adminsList = adminUsers.filter(user => user.user_type === 'admin');
      
      return { clients: clientsList, drivers: driversList, admins: adminsList };
    } else {
      console.warn("Pas de données de l'Auth API ou erreur:", authError);
    }
  } catch (authApiError) {
    console.warn("Erreur lors de l'appel à l'Auth API:", authApiError);
  }
  
  // Last resort: Fetch user profiles directly
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, 
        email, 
        user_type, 
        user_profiles:user_profiles(
          first_name,
          last_name,
          company_name,
          phone
        )
      `);

    if (error) {
      console.warn("Erreur lors de la récupération des utilisateurs:", error);
      
      // Try one last time with just profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (profilesError) {
        throw profilesError;
      }
      
      if (profiles && profiles.length > 0) {
        const transformedUsers = profiles.map(profile => ({
          id: profile.user_id || profile.id,
          email: '',
          user_type: 'client',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          company_name: profile.company_name || '',
          phone: profile.phone || ''
        }));
        
        // Identify admins by email if available
        const usersWithAdmins = transformedUsers.map(user => {
          if (user.email === 'dkautomotive70@gmail.com') {
            return { ...user, user_type: 'admin' };
          }
          return user;
        });
        
        const clientsList = usersWithAdmins.filter(user => user.user_type === 'client');
        const driversList = usersWithAdmins.filter(user => user.user_type === 'chauffeur');
        const adminsList = usersWithAdmins.filter(user => user.user_type === 'admin');
        
        return { clients: clientsList, drivers: driversList, admins: adminsList };
      }
      
      throw error;
    }

    // Transform the data
    const transformedUsers = data.map(user => ({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      first_name: user.user_profiles?.[0]?.first_name || '',
      last_name: user.user_profiles?.[0]?.last_name || '',
      company_name: user.user_profiles?.[0]?.company_name,
      phone: user.user_profiles?.[0]?.phone,
      created_at: null
    }));

    // Identify admins by email if needed
    const usersWithAdmins = transformedUsers.map(user => {
      if (user.email === 'dkautomotive70@gmail.com' && user.user_type !== 'admin') {
        return { ...user, user_type: 'admin' };
      }
      return user;
    });

    // Filter users by type
    const clientsList = usersWithAdmins.filter(user => user.user_type === 'client');
    const driversList = usersWithAdmins.filter(user => user.user_type === 'chauffeur');
    const adminsList = usersWithAdmins.filter(user => user.user_type === 'admin');
    
    return { clients: clientsList, drivers: driversList, admins: adminsList };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Deletes a user by ID
 */
export const deleteUser = async (userId: string): Promise<void> => {
  // Try to use the edge function first
  try {
    const { data, error } = await supabase.functions.invoke('admin_delete_user', {
      body: { userId }
    });
    
    if (!error) {
      return;
    } else {
      console.warn("Erreur avec l'edge function:", error);
    }
  } catch (edgeFnError) {
    console.warn("Erreur lors de l'appel à l'edge function:", edgeFnError);
  }
  
  // Fallback: Direct deletion
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
}
