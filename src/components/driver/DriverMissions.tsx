import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader } from "@/components/ui/loader";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "../client/MissionStatusBadge";
import { toast } from "sonner";

const DriverMissions = () => {
  const { user } = useAuthContext();
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure all required fields exist
      const typedData: MissionRow[] = (data || []).map(item => ({
        ...item as any,
        pickup_address: (item as any).pickup_address || "",
        delivery_address: (item as any).delivery_address || "",
        status: (item as any).status || "en_attente"
      }));
      
      setMissions(typedData);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  const updateMissionStatus = async (missionId: string, newStatus: "prise_en_charge" | "livre" | "incident") => {
    try {
      setUpdatingId(missionId);
      
      const { error } = await supabase
        .from('missions')
        .update({ status: newStatus })
        .eq('id', missionId);

      if (error) throw error;
      
      // Update the local state
      setMissions(prev => 
        prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: newStatus } as MissionRow
            : mission
        )
      );
      
      toast.success(`Statut de la mission mis à jour : ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes missions</h1>
        <p className="text-muted-foreground">Suivez l'état de vos missions</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <Tabs defaultValue="en_cours" className="space-y-4">
          <TabsList>
            <TabsTrigger value="en_cours">Missions en cours</TabsTrigger>
            <TabsTrigger value="terminees">Missions terminées</TabsTrigger>
            <TabsTrigger value="problemes">Missions avec problèmes</TabsTrigger>
          </TabsList>

          <TabsContent value="en_cours" className="space-y-4">
            {missions.filter(mission => mission.status !== 'termine' && mission.status !== 'livre' && mission.status !== 'incident').length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {missions.filter(mission => mission.status !== 'termine' && mission.status !== 'livre' && mission.status !== 'incident').map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <CardTitle>Mission N°{mission.mission_number || 'N/A'}</CardTitle>
                      <CardDescription>
                        {formatDate(mission.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Départ:</strong> {mission.pickup_address}
                      </p>
                      <p>
                        <strong>Arrivée:</strong> {mission.delivery_address}
                      </p>
                      <MissionStatusBadge status={mission.status} />
                      <div className="flex justify-end gap-2 mt-4">
                        {mission.status === 'confirme' || mission.status === 'confirmé' ? (
                          <Button 
                            variant="outline" 
                            onClick={() => updateMissionStatus(mission.id, "prise_en_charge")}
                            disabled={updatingId === mission.id}
                          >
                            {updatingId === mission.id ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                            Prise en charge
                          </Button>
                        ) : mission.status === 'prise_en_charge' ? (
                          <Button 
                            variant="outline"
                            onClick={() => updateMissionStatus(mission.id, "livre")}
                            disabled={updatingId === mission.id}
                          >
                            {updatingId === mission.id ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                            Livrer
                          </Button>
                        ) : null}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={updatingId === mission.id}>
                              Signaler un problème
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Voulez-vous signaler un problème pour cette mission ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => updateMissionStatus(mission.id, "incident")} disabled={updatingId === mission.id}>
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune mission en cours</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="terminees" className="space-y-4">
            {missions.filter(mission => mission.status === 'termine' || mission.status === 'livre').length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {missions.filter(mission => mission.status === 'termine' || mission.status === 'livre').map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <CardTitle>Mission N°{mission.mission_number || 'N/A'}</CardTitle>
                      <CardDescription>
                        {formatDate(mission.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Départ:</strong> {mission.pickup_address}
                      </p>
                      <p>
                        <strong>Arrivée:</strong> {mission.delivery_address}
                      </p>
                      <MissionStatusBadge status={mission.status} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune mission terminée</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="problemes" className="space-y-4">
            {missions.filter(mission => mission.status === 'incident').length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {missions.filter(mission => mission.status === 'incident').map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <CardTitle>Mission N°{mission.mission_number || 'N/A'}</CardTitle>
                      <CardDescription>
                        {formatDate(mission.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Départ:</strong> {mission.pickup_address}
                      </p>
                      <p>
                        <strong>Arrivée:</strong> {mission.delivery_address}
                      </p>
                      <MissionStatusBadge status={mission.status} />
                      <div className="flex justify-end">
                        <Button variant="destructive" disabled>
                          Résoudre le problème
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune mission avec des problèmes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DriverMissions;
