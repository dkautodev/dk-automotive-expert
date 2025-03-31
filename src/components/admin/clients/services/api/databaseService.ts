
import { supabase } from "@/integrations/supabase/client";
import { FetchUsersResponse } from "../../types/clientManagementTypes";

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
          const transformedUsers = profiles.map(profile => {
            // Use default type since user_type is not in the profile schema
            const userType = 'client'; 
            
            return {
              id: profile.user_id || profile.id,
              email: '',
              user_type: userType,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              company_name: profile.company_name || '',
              phone: profile.phone || ''
            };
          });
          
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
