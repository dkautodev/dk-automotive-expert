
import { useState } from "react";
import { toast } from "sonner";
import { MissionRow } from "@/types/database";
import { mockCancelMission } from "@/services/mockMissionService"; 

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
      
      // Mock implementation instead of using Supabase directly
      const success = await mockCancelMission(selectedMissionId);
      
      if (success) {
        toast.success("La mission a été annulée avec succès");
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Error cancelling mission");
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
