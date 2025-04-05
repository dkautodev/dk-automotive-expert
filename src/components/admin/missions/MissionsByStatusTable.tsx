
import React from "react";
import { MissionsTable } from "./MissionsTable";
import { MissionsTableSkeleton } from "./MissionsTableSkeleton";
import { EmptyMissionsState } from "./EmptyMissionsState";
import { useMissions } from "@/hooks/useMissions";

interface MissionsByStatusTableProps {
  refreshTrigger?: number;
  status?: string | string[];
  showAllMissions?: boolean;
  emptyMessage?: string;
  limit?: number;
  forceAdminView?: boolean;
}

const MissionsByStatusTable: React.FC<MissionsByStatusTableProps> = ({ 
  refreshTrigger = 0, 
  status,
  showAllMissions = false,
  emptyMessage = "Aucune mission disponible",
  limit,
  forceAdminView = true // Default to true for admin dashboard
}) => {
  const { missions, loading, error, refetch } = useMissions({ 
    refreshTrigger,
    showAllMissions,
    filterStatus: status,
    limit,
    forceAdminView // Explicitement passer le flag admin
  });

  console.log(`MissionsByStatusTable: status=${status}, showAllMissions=${showAllMissions}, forceAdminView=${forceAdminView}, missions.length=${missions.length}, error=${error ? 'Yes' : 'No'}`);

  const handleMissionCancelled = () => {
    // Trigger a refresh when a mission is cancelled
    refetch();
    console.log("Mission cancelled, refreshing data");
  };

  // If there's an error and no missions, show the empty state with error message
  if (error && missions.length === 0) {
    return (
      <EmptyMissionsState 
        showAllMissions={showAllMissions} 
        message="Erreur lors de la récupération des missions" 
      />
    );
  }

  return (
    <>
      {loading ? (
        <MissionsTableSkeleton />
      ) : missions.length > 0 ? (
        <MissionsTable 
          missions={missions} 
          onMissionCancelled={handleMissionCancelled} 
        />
      ) : (
        <EmptyMissionsState 
          showAllMissions={showAllMissions} 
          message={emptyMessage} 
        />
      )}
    </>
  );
};

export default MissionsByStatusTable;
