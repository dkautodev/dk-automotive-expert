
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCards from "./DashboardCards";
import CreateMissionDialog from "../mission-form/CreateMissionDialog";
import MissionsByStatusTable from "./missions/MissionsByStatusTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminHome = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effect to force refresh on initial load
  useEffect(() => {
    console.log("AdminHome initial load, setting refresh trigger to 1");
    setRefreshTrigger(1);
  }, []);

  const handleRefresh = useCallback(() => {
    // Increment refresh trigger to force dashboard updates
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    console.log("Dashboard refreshed with value:", newValue);
  }, [refreshTrigger]);

  const handleMissionCreated = useCallback(() => {
    handleRefresh();
    toast.success("Mission créée avec succès! Le tableau de bord est mis à jour.");
  }, [handleRefresh]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="p-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Rafraîchir
          </button>
          <CreateMissionDialog onMissionCreated={handleMissionCreated} />
        </div>
      </div>
      
      <DashboardCards refreshTrigger={refreshTrigger} />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Devis en attente</TabsTrigger>
          <TabsTrigger value="ongoing">Missions en cours</TabsTrigger>
          <TabsTrigger value="completed">Missions terminées</TabsTrigger>
          <TabsTrigger value="all">Toutes les missions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Devis en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status="en_attente"
                emptyMessage="Aucun devis en attente"
                forceAdminView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ongoing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Missions en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status={["confirmé", "confirme", "prise_en_charge"]}
                emptyMessage="Aucune mission en cours"
                forceAdminView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Missions terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status={["termine", "livre"]}
                emptyMessage="Aucune mission terminée"
                forceAdminView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les missions</CardTitle>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                showAllMissions={true}
                emptyMessage="Aucune mission trouvée"
                forceAdminView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
