
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "../types";
import { FetchUsersResponse } from "../types/clientManagementTypes";

/**
 * Edge function module for user data fetching
 */
export const edgeFunctionService = {
  /**
   * Fetches users with profiles via edge function
   */
  fetchUsersViaEdgeFunction: async (): Promise<FetchUsersResponse | null> => {
    try {
      const { data: usersData, error: usersError } = await supabase.functions.invoke<any[]>('get_users_with_profiles');

      if (usersError) {
        console.warn("Erreur avec l'edge function:", usersError);
        return null;
      }
      
      if (!usersData || usersData.length === 0) {
        console.warn("Pas de données de l'Edge Function");
        return null;
      }
      
      console.log("Utilisateurs récupérés via Edge Function:", usersData);
      
      // Filter by user type
      const clientsList = usersData.filter(user => user.user_type === 'client');
      const driversList = usersData.filter(user => user.user_type === 'chauffeur');
      const adminsList = usersData.filter(user => user.user_type === 'admin');
      
      return { clients: clientsList, drivers: driversList, admins: adminsList };
    } catch (edgeFnError) {
      console.warn("Erreur lors de l'appel à l'Edge Function:", edgeFnError);
      return null;
    }
  }
};

/**
 * Auth API module for user data fetching
 */
export const authApiService = {
  /**
   * Fetches users via Supabase Auth API
   */
  fetchUsersViaAuthApi: async (): Promise<FetchUsersResponse | null> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError || !authData?.users) {
        console.warn("Erreur avec l'Auth API:", authError);
        return null;
      }
      
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
      
      // Detect admin email if necessary
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
    } catch (authApiError) {
      console.warn("Erreur lors de l'appel à l'Auth API:", authApiError);
      return null;
    }
  }
};

/**
 * Direct database module for user data fetching
 */
export const databaseService = {
  /**
   * Fetches users directly from database tables
   */
  fetchUsersFromDatabase: async (): Promise<FetchUsersResponse | null> => {
    try {
      // Try to fetch users from the joint table first
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
          return null;
        }
        
        if (profiles && profiles.length > 0) {
          const transformedUsers = profiles.map(profile => ({
            id: profile.user_id || profile.id,
            email: '',
            user_type: profile.user_type || 'client',
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
        
        return null;
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
      console.error('Error fetching users from database:', error);
      return null;
    }
  }
};

/**
 * User deletion module
 */
export const userDeletionService = {
  /**
   * Attempts to delete a user via edge function
   */
  deleteUserViaEdgeFunction: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('admin_delete_user', {
        body: { userId }
      });
      
      if (error) {
        console.warn("Erreur avec l'edge function pour la suppression:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn("Erreur lors de l'appel à l'edge function de suppression:", error);
      return false;
    }
  },

  /**
   * Attempts to delete a user directly from database
   */
  deleteUserFromDatabase: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Erreur lors de la suppression directe de l'utilisateur:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression directe de l'utilisateur:", error);
      return false;
    }
  }
};

/**
 * Main service module that orchestrates the user operations
 */
export const userService = {
  /**
   * Fetches users with profiles from various sources
   * Tries edge function first, then Auth API, then direct database access
   */
  fetchUsersWithProfiles: async (): Promise<FetchUsersResponse> => {
    // Try with Edge Function first
    const edgeFunctionResult = await edgeFunctionService.fetchUsersViaEdgeFunction();
    if (edgeFunctionResult) {
      return edgeFunctionResult;
    }
    
    // Fallback: Auth API
    const authApiResult = await authApiService.fetchUsersViaAuthApi();
    if (authApiResult) {
      return authApiResult;
    }
    
    // Last resort: Direct database access
    const databaseResult = await databaseService.fetchUsersFromDatabase();
    if (databaseResult) {
      return databaseResult;
    }
    
    // If all methods fail, return empty lists
    return { clients: [], drivers: [], admins: [] };
  },

  /**
   * Deletes a user by ID
   * Tries edge function first, then direct database deletion
   */
  deleteUser: async (userId: string): Promise<void> => {
    // Try edge function deletion first
    const edgeFunctionSuccess = await userDeletionService.deleteUserViaEdgeFunction(userId);
    if (edgeFunctionSuccess) {
      return;
    }
    
    // Fallback: Direct deletion from database
    const databaseSuccess = await userDeletionService.deleteUserFromDatabase(userId);
    if (!databaseSuccess) {
      throw new Error("Failed to delete user");
    }
  }
};

// Export individually for direct importing
export const { fetchUsersWithProfiles, deleteUser } = userService;
