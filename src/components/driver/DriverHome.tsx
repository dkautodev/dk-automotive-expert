
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, CheckCircle, CircleDollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "../client/MissionStatusBadge";

const DriverHome = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    assignedMissions: 0,
    completedMissions: 0,
    inProgressMissions: 0,
    monthlyEarnings: 0
  });
  const [recentMissions, setRecentMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDriverStats();
      fetchRecentMissions();
    }
  }, [user]);

  const fetchDriverStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id);

      if (error) throw error;

      const missionsList = data || [];
      const assigned = missionsList ? missionsList.length : 0;
      const completed = missionsList ? missionsList.filter(m => m.status === 'termine').length : 0;
      const inProgress = missionsList ? missionsList.filter(m => m.status === 'prise_en_charge').length : 0;
      
      // Calculate earnings from completed missions
      const earnings = missionsList 
        ? missionsList
            .filter(m => m.status === 'termine')
            .reduce((sum, mission) => sum + (mission.price_ht || 0), 0)
        : 0;

      setStats({
        assignedMissions: assigned,
        completedMissions: completed,
        inProgressMissions: inProgress,
        monthlyEarnings: earnings
      });
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Ensure all required fields exist
      const typedData: MissionRow[] = (data || []).map(item => ({
        ...item as any,
        pickup_address: (item as any).pickup_address || "",
        delivery_address: (item as any).delivery_address || "",
      }));
      
      setRecentMissions(typedData);
    } catch (error) {
      console.error('Error fetching recent missions:', error);
    }
  };

  if (loading) {
    return <Loader className="mx-auto my-12" />;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Chauffeur</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace chauffeur.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Missions assignées</CardTitle>
            <CardDescription>Total de vos missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stats.assignedMissions}</span>
              <Truck className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">En cours</CardTitle>
            <CardDescription>Missions en livraison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stats.inProgressMissions}</span>
              <Clock className="h-8 w-8 text-amber-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Complétées</CardTitle>
            <CardDescription>Missions terminées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stats.completedMissions}</span>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Revenus du mois</CardTitle>
            <CardDescription>Total HT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stats.monthlyEarnings.toFixed(2)}€</span>
              <CircleDollarSign className="h-8 w-8 text-emerald-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Missions */}
      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
          <CardDescription>Vos dernières missions assignées</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMissions.length > 0 ? (
            <div className="space-y-4">
              {recentMissions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{mission.mission_number || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-md">
                      {mission.pickup_address || 'Adresse non spécifiée'} → {mission.delivery_address || 'Adresse non spécifiée'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MissionStatusBadge status={mission.status} />
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}

              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/dashboard/driver/missions">Voir toutes les missions</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>Aucune mission ne vous a été assignée pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverHome;
