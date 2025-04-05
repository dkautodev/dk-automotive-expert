
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
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);

  const handleCancelMission = (mission: MissionRow) => {
    setSelectedMissionId(mission.id);
    setSelectedMission(mission);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelMission = async () => {
    if (!selectedMissionId) return;
    
    try {
      setIsLoading(true);
      console.log("Cancelling mission with ID:", selectedMissionId);
      
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
      setSelectedMission(null);
    }
  };

  return {
    selectedMissionId,
    selectedMission,
    isCancelDialogOpen,
    isLoading,
    handleCancelMission,
    confirmCancelMission,
    setIsCancelDialogOpen
  };
}
