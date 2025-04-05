
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MissionsTable } from "./missions/MissionsTable";
import { MissionsTableSkeleton } from "./missions/MissionsTableSkeleton";
import { EmptyMissionsState } from "./missions/EmptyMissionsState";
import { useMissions } from "./missions/useMissions";

interface OngoingMissionsTableProps {
  refreshTrigger?: number;
  showAllMissions?: boolean;
}

const OngoingMissionsTable = ({ 
  refreshTrigger = 0, 
  showAllMissions = false 
}: OngoingMissionsTableProps) => {
  const { missions, loading } = useMissions({ 
    refreshTrigger,
    showAllMissions,
    filterStatus: ['confirmé', 'confirme', 'prise_en_charge']
  });

  const handleMissionCancelled = () => {
    // This will be handled by the refreshTrigger from the parent
    console.log("Mission cancelled, parent will handle refresh");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {showAllMissions ? "Toutes les missions en cours" : "Missions en cours"}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            message="Aucune mission en cours" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingMissionsTable;
