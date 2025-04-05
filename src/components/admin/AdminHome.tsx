
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import DashboardCards from "./DashboardCards";
import CreateMissionDialog from "../mission-form/CreateMissionDialog";
import MissionsByStatusTable from "./missions/MissionsByStatusTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminHome = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  // Effect pour forcer un rafraîchissement périodique
  useEffect(() => {
    console.log("AdminHome initial load, setting refresh trigger to 1");
    setRefreshTrigger(1);
    
    // Rafraîchissement automatique toutes les 90 secondes au lieu de 15 secondes
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      setLastRefreshTime(new Date());
      console.log("Rafraîchissement automatique du dashboard admin", new Date().toISOString());
    }, 90000); // Changé de 15000 à 90000 (90 secondes)
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = useCallback(() => {
    // Incrémenter refresh trigger pour forcer le rafraîchissement
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("Dashboard explicitement rafraîchi avec la valeur:", newValue, "à", new Date().toISOString());
    toast.success("Tableau de bord rafraîchi");
  }, [refreshTrigger]);

  const handleMissionCreated = useCallback(() => {
    // Force une mise à jour plus agressive après la création d'une mission
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("Nouvelle mission créée, rafraîchissement du tableau de bord avec valeur:", newValue, "à", new Date().toISOString());
    toast.success("Mission créée avec succès! Le tableau de bord est mis à jour.");
  }, [refreshTrigger]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Refresh data when changing tabs
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    setLastRefreshTime(new Date());
    console.log("Changement d'onglet vers", value, "rafraîchissement avec valeur:", newValue, "à", new Date().toISOString());
  };

  const formattedRefreshTime = lastRefreshTime.toLocaleTimeString();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
          <CreateMissionDialog onMissionCreated={handleMissionCreated} />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-right">
        Dernière actualisation: {formattedRefreshTime}
      </div>
      
      <DashboardCards refreshTrigger={refreshTrigger} />
      
      <Tabs 
        defaultValue="pending" 
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Devis en attente</TabsTrigger>
          <TabsTrigger value="ongoing">Missions en cours</TabsTrigger>
          <TabsTrigger value="delivered">Véhicules livrés</TabsTrigger>
          <TabsTrigger value="incident">Incidents</TabsTrigger>
          <TabsTrigger value="completed">Missions terminées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Devis en attente</CardTitle>
              <span className="text-sm text-muted-foreground">
                Actualisé à {formattedRefreshTime}
              </span>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status="en_attente"
                emptyMessage="Aucun devis en attente"
                forceAdminView={true}
                displayType="pending"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ongoing" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Missions en cours</CardTitle>
              <span className="text-sm text-muted-foreground">
                Actualisé à {formattedRefreshTime}
              </span>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status={["confirmé", "confirme", "prise_en_charge"]}
                emptyMessage="Aucune mission en cours"
                forceAdminView={true}
                displayType="ongoing"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Véhicules livrés</CardTitle>
              <span className="text-sm text-muted-foreground">
                Actualisé à {formattedRefreshTime}
              </span>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status="livre"
                emptyMessage="Aucun véhicule livré"
                forceAdminView={true}
                displayType="delivered"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incident" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incidents</CardTitle>
              <span className="text-sm text-muted-foreground">
                Actualisé à {formattedRefreshTime}
              </span>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status="incident"
                emptyMessage="Aucun incident"
                forceAdminView={true}
                displayType="incident"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Missions terminées</CardTitle>
              <span className="text-sm text-muted-foreground">
                Actualisé à {formattedRefreshTime}
              </span>
            </CardHeader>
            <CardContent>
              <MissionsByStatusTable 
                refreshTrigger={refreshTrigger} 
                status="termine"
                emptyMessage="Aucune mission terminée"
                forceAdminView={true}
                displayType="completed"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
