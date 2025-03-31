
import { supabase } from "@/integrations/supabase/client";

/**
 * User data fetching module
 */
export const userDataService = {
  /**
   * Fetches user data from Edge Function by user ID
   */
  fetchUserById: async (userId: string): Promise<any> => {
    try {
      const { data: userData, error: userError } = await supabase.functions.invoke<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        company_name: string;
        user_type: string;
      }>(
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
  }
};
