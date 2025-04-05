
import React, { useEffect } from "react";
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

  // Utiliser useEffect pour journaliser les informations sur les missions à chaque mise à jour
  useEffect(() => {
    console.log(`MissionsByStatusTable [${new Date().toISOString()}]: 
      - status: ${Array.isArray(status) ? status.join(', ') : status || 'Tous'}
      - showAllMissions: ${showAllMissions}
      - forceAdminView: ${forceAdminView}
      - refreshTrigger: ${refreshTrigger}
      - missions.length: ${missions.length}
      - error: ${error ? 'Oui' : 'Non'}
      - loading: ${loading ? 'Oui' : 'Non'}
    `);
    
    if (missions.length > 0) {
      console.log("Premier ID de mission:", missions[0].id);
      console.log("Premier numéro de mission:", missions[0].mission_number);
    }
  }, [status, showAllMissions, forceAdminView, missions, error, loading, refreshTrigger]);

  // Forcer un rafraîchissement périodique plus fréquent
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Rafraîchissement forcé de MissionsByStatusTable", new Date().toISOString());
      refetch();
    }, 5000); // Refetch every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  const handleMissionCancelled = () => {
    // Trigger a refresh when a mission is cancelled
    refetch();
    console.log("Mission cancelled, refreshing data");
  };

  // If there's an error and no missions, show the empty state with error message
  if (error) {
    console.error("Erreur dans MissionsByStatusTable:", error);
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
        <MissionsTableSkeleton message="Chargement des missions en cours..." />
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
