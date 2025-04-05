
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseStatusChangeProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useStatusChange({ onSuccess, onError }: UseStatusChangeProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates the status of a mission
   * @param missionId The ID of the mission to update
   * @param newStatus The new status to set
   */
  const updateMissionStatus = async (missionId: string, newStatus: string) => {
    if (!missionId) {
      console.error("Mission ID is required to update status");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Changing mission status: ${missionId} to ${newStatus}`);
      
      const { error } = await supabase
        .from('missions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', missionId);
      
      if (error) {
        console.error("Error updating mission status:", error);
        throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
      }
      
      console.log(`Status successfully changed to ${newStatus}`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in updateMissionStatus:", error);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateMissionStatus,
    isLoading
  };
}
