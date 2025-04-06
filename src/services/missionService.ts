
import { supabase } from "@/integrations/supabase/client";

/**
 * Service pour les opérations liées aux missions
 */
export const missionService = {
  /**
   * Obtient le numéro de mission à partir de l'ID
   */
  getMissionNumber: async (missionId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('mission_number')
        .eq('id', missionId)
        .single();
      
      if (error || !data) {
        console.error("Erreur lors de la récupération du numéro de mission:", error);
        return null;
      }
      
      return data.mission_number;
    } catch (error) {
      console.error("Erreur lors de la récupération du numéro de mission:", error);
      return null;
    }
  },
  
  /**
   * Récupère les pièces jointes d'une mission
   */
  getMissionAttachments: async (missionId: string) => {
    try {
      console.log("Récupération des pièces jointes pour la mission:", missionId);
      
      const { data, error } = await supabase
        .from('mission_attachments')
        .select('*')
        .eq('mission_id', missionId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erreur lors de la récupération des pièces jointes:", error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces jointes:", error);
      return { data: null, error };
    }
  },
  
  /**
   * Vérifie si un fichier existe dans le stockage Supabase
   */
  checkFileExists: async (filePath: string): Promise<boolean> => {
    try {
      const pathParts = filePath.split('/');
      const fileName = pathParts.pop() || '';
      const dirPath = pathParts.join('/');
      
      const { data, error } = await supabase.storage
        .from('mission-attachments')
        .list(dirPath, {
          search: fileName
        });
        
      if (error) {
        console.error("Erreur lors de la vérification de l'existence du fichier:", error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'existence du fichier:", error);
      return false;
    }
  }
};
