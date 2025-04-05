
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import MissionsByStatusTable from "@/components/admin/missions/MissionsByStatusTable";
import CreateMissionDialog from "@/components/mission-form/CreateMissionDialog";
import { useAuthContext } from "@/context/AuthContext";

const TotalCourses = () => {
  const { role } = useAuthContext();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  useEffect(() => {
    console.log("TotalCourses: Chargement initial");
    setRefreshTrigger(1);
    
    // Rafraîchissement automatique moins fréquent (toutes les 90 secondes pour les clients/chauffeurs)
    const refreshInterval = role === 'admin' ? 10000 : 90000; // 10 sec pour admin, 90 sec pour autres
    
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      setLastRefreshTime(new Date());
      console.log(`TotalCourses: Rafraîchissement automatique [${role}]`, new Date().toISOString());
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [role]);

  const handleRefresh = () => {
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("TotalCourses: Rafraîchissement manuel", new Date().toISOString(), "nouvelle valeur:", newValue);
    toast.success("Tableau de missions rafraîchi");
  };

  const handleMissionCreated = () => {
    console.log("TotalCourses: Nouvelle mission créée, rafraîchissement");
    
    // Rafraîchir immédiatement
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    
    // Puis à nouveau après un court délai pour s'assurer que les données sont à jour
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
      console.log("TotalCourses: Rafraîchissement différé après création de mission");
    }, 2000);
    
    toast.success("Mission créée, actualisation du tableau");
  };

  const formattedRefreshTime = lastRefreshTime.toLocaleTimeString();

  // Déterminer si le bouton de rafraîchissement doit être affiché 
  // (toujours pour admin, sinon géré par le composant MissionsByStatusTable)
  const showRefreshButtonInHeader = role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Total des Courses</h1>
        <div className="flex gap-2 self-end sm:self-auto">
          <CreateMissionDialog onMissionCreated={handleMissionCreated} />
          {showRefreshButtonInHeader && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
          )}
        </div>
      </div>
      
      {showRefreshButtonInHeader && (
        <div className="text-xs text-gray-500 text-right">
          Dernière actualisation: {formattedRefreshTime}
        </div>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Toutes les missions</CardTitle>
          {showRefreshButtonInHeader && (
            <span className="text-sm text-muted-foreground">
              Actualisé à {formattedRefreshTime}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <MissionsByStatusTable 
            refreshTrigger={refreshTrigger} 
            showAllMissions={true}
            emptyMessage="Aucune mission trouvée dans la base de données"
            forceAdminView={true}  // S'assurer que ce paramètre est explicitement défini à true
            showRefreshButton={!showRefreshButtonInHeader} // Éviter d'afficher deux boutons pour les admins
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalCourses;
