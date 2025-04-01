
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionRow } from "@/types/database";

interface UseMissionCancellationProps {
  onSuccess?: () => void;
}

export function useMissionCancellation({ onSuccess }: UseMissionCancellationProps = {}) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelMission = async () => {
    if (!selectedMissionId) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('missions')
        .update({ status: 'annulé' })
        .eq('id', selectedMissionId);
        
      if (error) {
        console.error("Error cancelling mission:", error);
        throw error;
      }
      
      toast.success("La mission a été annulée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error cancelling mission:", error);
      toast.error("Erreur lors de l'annulation de la mission");
    } finally {
      setIsLoading(false);
      setIsCancelDialogOpen(false);
      setSelectedMissionId(null);
    }
  };

  return {
    selectedMissionId,
    isCancelDialogOpen,
    isLoading,
    handleCancelMission,
    confirmCancelMission,
    setIsCancelDialogOpen
  };
}
