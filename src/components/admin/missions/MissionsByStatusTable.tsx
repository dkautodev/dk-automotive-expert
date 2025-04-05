import React, { useEffect, useState } from "react";
import { MissionsTable } from "./MissionsTable";
import { MissionsTableSkeleton } from "./MissionsTableSkeleton";
import { EmptyMissionsState } from "./EmptyMissionsState";
import { useMissions } from "@/hooks/useMissions";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface MissionsByStatusTableProps {
  refreshTrigger?: number;
  status?: string | string[];
  showAllMissions?: boolean;
  emptyMessage?: string;
  limit?: number;
  forceAdminView?: boolean;
  showRefreshButton?: boolean;
  displayType?: 'pending' | 'ongoing' | 'delivered' | 'incident' | 'completed' | 'default';
}

const MissionsByStatusTable: React.FC<MissionsByStatusTableProps> = ({ 
  refreshTrigger = 0, 
  status,
  showAllMissions = false,
  emptyMessage = "Aucune mission disponible",
  limit,
  forceAdminView = false,
  showRefreshButton = true,
  displayType = 'default'
}) => {
  const { role } = useAuthContext();
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(refreshTrigger);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  
  const { missions, loading, error, refetch } = useMissions({ 
    refreshTrigger: localRefreshTrigger,
    showAllMissions,
    filterStatus: status,
    limit,
    forceAdminView
  });

  useEffect(() => {
    console.log(`MissionsByStatusTable [${new Date().toISOString()}]: 
      - status: ${Array.isArray(status) ? status.join(', ') : status || 'Tous'}
      - showAllMissions: ${showAllMissions}
      - forceAdminView: ${forceAdminView}
      - refreshTrigger: ${refreshTrigger}
      - localRefreshTrigger: ${localRefreshTrigger}
      - missions.length: ${missions.length}
      - error: ${error ? 'Oui' : 'Non'}
      - loading: ${loading ? 'Oui' : 'Non'}
      - displayType: ${displayType}
    `);
    
    if (missions.length > 0) {
      console.log("Premier ID de mission:", missions[0].id);
      console.log("Premier numéro de mission:", missions[0].mission_number);
      console.log("Premier statut de mission:", missions[0].status);
      console.log("Client ID de la première mission:", missions[0].client_id);
      console.log("Admin ID de la première mission:", missions[0].admin_id);
    }
  }, [status, showAllMissions, forceAdminView, missions, error, loading, refreshTrigger, localRefreshTrigger, displayType]);

  useEffect(() => {
    setLocalRefreshTrigger(refreshTrigger);
  }, [refreshTrigger]);

  useEffect(() => {
    const refreshInterval = 90000; // 90 secondes pour tous
    
    const intervalId = setInterval(() => {
      console.log(`Rafraîchissement automatique de MissionsByStatusTable [${role}]`, new Date().toISOString());
      setLocalRefreshTrigger(prev => prev + 1);
      setLastRefreshTime(new Date());
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [role]);

  const handleManualRefresh = () => {
    const newValue = localRefreshTrigger + 1;
    setLocalRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("Rafraîchissement manuel, nouvelle valeur:", newValue);
    toast.success("Tableau de missions rafraîchi");
  };

  const handleMissionCancelled = () => {
    refetch();
    console.log("Mission cancelled, refreshing data");
  };

  const handleMissionUpdated = () => {
    refetch();
    console.log("Mission updated, refreshing data");
  };

  if (error) {
    console.error("Erreur dans MissionsByStatusTable:", error);
    return (
      <EmptyMissionsState 
        showAllMissions={showAllMissions} 
        message="Erreur lors de la récupération des missions" 
      />
    );
  }

  const formattedRefreshTime = lastRefreshTime.toLocaleTimeString();

  return (
    <>
      {showRefreshButton && (role === 'client' || role === 'chauffeur' || !role) && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Dernière actualisation: {formattedRefreshTime}
          </div>
          <Button 
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      )}

      {loading ? (
        <MissionsTableSkeleton message="Chargement des missions en cours..." />
      ) : missions.length > 0 ? (
        <MissionsTable 
          missions={missions} 
          onMissionCancelled={handleMissionCancelled}
          onMissionUpdated={handleMissionUpdated}
          displayType={displayType}
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
