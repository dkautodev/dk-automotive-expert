
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { DashboardCards } from "./DashboardCards";
import { PendingInvoicesTable } from "./PendingInvoicesTable";
import CompletedMissionsTable from "./CompletedMissionsTable";
import ClientManagement from "./ClientManagement";
import CreateMissionDialog from "../mission-form/CreateMissionDialog";
import { BarChart, LineChart, PieChart, MapPin, Users, TruckIcon } from "lucide-react";

const AdminHome = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching missions:', error);
        return;
      }
      
      setMissions(data || []);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMissionCreated = () => {
    fetchMissions();
  };

  const pendingInvoices = missions.filter(mission => 
    mission.status === 'confirme' || mission.status === 'confirmé'
  );
  
  const completedMissions = missions.filter(mission => 
    mission.status === 'termine'
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Bienvenue sur le panneau d'administration</p>
        </div>
        <div className="flex gap-2">
          <CreateMissionDialog onMissionCreated={handleMissionCreated} />
          <Button variant="outline" asChild>
            <Link to="/dashboard/admin/pricing-grids">
              Grilles tarifaires
            </Link>
          </Button>
        </div>
      </div>
      
      <DashboardCards />
      
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Gestion des clients et chauffeurs
          </TabsTrigger>
          <TabsTrigger value="missions">
            <TruckIcon className="h-4 w-4 mr-2" />
            Missions
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <ClientManagement />
        </TabsContent>
        
        <TabsContent value="missions" className="space-y-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader className="h-8 w-8" />
            </div>
          ) : (
            <>
              <PendingInvoicesTable missions={pendingInvoices} />
              <CompletedMissionsTable missions={completedMissions} />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des missions</CardTitle>
              <CardDescription>Vue d'ensemble des performances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenus mensuels</CardTitle>
                  </CardHeader>
                  <CardContent className="aspect-[4/3] flex items-center justify-center bg-muted/20">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Graphique des revenus</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Type de missions</CardTitle>
                  </CardHeader>
                  <CardContent className="aspect-[4/3] flex items-center justify-center bg-muted/20">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Répartition par type</span>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Distribution géographique</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Carte des livraisons</span>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
