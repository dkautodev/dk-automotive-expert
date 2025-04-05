
import React from "react";
import { MissionsTable } from "./MissionsTable";
import { MissionsTableSkeleton } from "./MissionsTableSkeleton";
import { EmptyMissionsState } from "./EmptyMissionsState";
import { useMissions } from "../../../hooks/useMissions";

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
  const { missions, loading } = useMissions({ 
    refreshTrigger,
    showAllMissions,
    filterStatus: status
  });

  const handleMissionCancelled = () => {
    // This will be handled by the refreshTrigger from the parent component
    console.log("Mission cancelled, parent will handle refresh");
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
