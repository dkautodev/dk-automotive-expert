
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import MissionsByStatusTable from "@/components/admin/missions/MissionsByStatusTable";
import CreateMissionDialog from "@/components/mission-form/CreateMissionDialog";

const TotalCourses = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  useEffect(() => {
    console.log("TotalCourses: Chargement initial");
    setRefreshTrigger(1);
    
    // Rafraîchissement automatique toutes les 15 secondes
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      setLastRefreshTime(new Date());
      console.log("TotalCourses: Rafraîchissement automatique", new Date().toISOString());
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("TotalCourses: Rafraîchissement manuel", new Date().toISOString());
    toast.success("Tableau de missions rafraîchi");
  };

  const handleMissionCreated = () => {
    console.log("TotalCourses: Nouvelle mission créée, rafraîchissement");
    setRefreshTrigger(prev => prev + 1);
    setLastRefreshTime(new Date());
    toast.success("Mission créée, actualisation du tableau");
  };

  const formattedRefreshTime = lastRefreshTime.toLocaleTimeString();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Total des Courses</h1>
        <div className="flex gap-2 self-end sm:self-auto">
          <CreateMissionDialog onMissionCreated={handleMissionCreated} />
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-right">
        Dernière actualisation: {formattedRefreshTime}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Toutes les missions</CardTitle>
          <span className="text-sm text-muted-foreground">
            Actualisé à {formattedRefreshTime}
          </span>
        </CardHeader>
        <CardContent>
          <MissionsByStatusTable 
            refreshTrigger={refreshTrigger} 
            showAllMissions={true}
            emptyMessage="Aucune mission trouvée dans la base de données"
            forceAdminView={true}  // S'assurer que ce paramètre est bien passé à true
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalCourses;
