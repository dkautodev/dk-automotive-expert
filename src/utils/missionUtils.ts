
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Updates the status of a mission in the database
 * 
 * @param missionId The ID of the mission to update
 * @param status The new status to set
 * @returns Promise resolving to success boolean
 */
export const updateMissionStatus = async (missionId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('missions')
      .update({ status })
      .eq('id', missionId);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error("Error updating mission status:", err);
    toast.error("Une erreur est survenue lors de la mise à jour du statut de la mission");
    return false;
  }
};

/**
 * Finds a mission by its mission number
 * 
 * @param missionNumber The mission number to search for
 * @returns Promise resolving to the mission ID if found, or null
 */
export const findMissionByNumber = async (missionNumber: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('id')
      .eq('mission_number', missionNumber)
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (err) {
    console.error("Error finding mission:", err);
    return null;
  }
};

/**
 * Updates a specific mission from "en_attente" to "confirmé" status
 * 
 * @param missionNumber The mission number to update
 * @returns Promise resolving to success boolean
 */
export const confirmMission = async (missionNumber: string): Promise<boolean> => {
  const missionId = await findMissionByNumber(missionNumber);
  
  if (!missionId) {
    toast.error(`Mission ${missionNumber} non trouvée`);
    return false;
  }
  
  const success = await updateMissionStatus(missionId, 'confirmé');
  
  if (success) {
    toast.success(`Mission ${missionNumber} confirmée avec succès`);
  }
  
  return success;
};
