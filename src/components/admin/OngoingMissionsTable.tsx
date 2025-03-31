
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMissions } from "./missions/useMissions";
import { MissionsTable } from "./missions/MissionsTable";
import { MissionsTableSkeleton } from "./missions/MissionsTableSkeleton";
import { EmptyMissionsState } from "./missions/EmptyMissionsState";

interface OngoingMissionsTableProps {
  refreshTrigger?: number;
  showAllMissions?: boolean;
}

const OngoingMissionsTable: React.FC<OngoingMissionsTableProps> = ({ 
  refreshTrigger = 0,
  showAllMissions = false
}) => {
  const { missions, loading } = useMissions({ refreshTrigger, showAllMissions });
  
  const title = showAllMissions ? "Toutes les missions" : "Missions en cours";

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {loading ? (
        <MissionsTableSkeleton title={title} />
      ) : (
        <CardContent>
          {missions.length > 0 ? (
            <MissionsTable missions={missions} />
          ) : (
            <EmptyMissionsState showAllMissions={showAllMissions} />
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default OngoingMissionsTable;
