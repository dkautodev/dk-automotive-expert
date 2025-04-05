
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
  forceAdminView = false // Par défaut à false, sera explicitement passé
}) => {
  const { missions, loading, error, refetch } = useMissions({ 
    refreshTrigger,
    showAllMissions,
    filterStatus: status,
    limit,
    forceAdminView // Transmettre explicitement le flag admin
  });

  // Ajouter des logs détaillés pour le débogage
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
      console.log("Premier statut de mission:", missions[0].status);
      console.log("Client ID de la première mission:", missions[0].client_id);
    }
  }, [status, showAllMissions, forceAdminView, missions, error, loading, refreshTrigger]);

  // Rafraîchissement périodique plus fréquent
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Rafraîchissement forcé de MissionsByStatusTable", new Date().toISOString());
      refetch();
    }, 5000); // Refetch every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  const handleMissionCancelled = () => {
    // Déclencher un rafraîchissement lorsqu'une mission est annulée
    refetch();
    console.log("Mission cancelled, refreshing data");
  };

  // S'il y a une erreur et pas de missions, afficher l'état vide avec un message d'erreur
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
