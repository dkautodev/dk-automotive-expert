
import { supabase } from "@/integrations/supabase/client";

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
