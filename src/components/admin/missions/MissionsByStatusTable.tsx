
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
}

const MissionsByStatusTable: React.FC<MissionsByStatusTableProps> = ({ 
  refreshTrigger = 0, 
  status,
  showAllMissions = false,
  emptyMessage = "Aucune mission disponible"
}) => {
  const { missions, loading, refetch } = useMissions({ 
    refreshTrigger,
    showAllMissions,
    filterStatus: status
  });

  console.log(`MissionsByStatusTable: status=${status}, showAllMissions=${showAllMissions}, missions.length=${missions.length}`);

  const handleMissionCancelled = () => {
    // Trigger a refresh when a mission is cancelled
    refetch();
    console.log("Mission cancelled, refreshing data");
  };

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
