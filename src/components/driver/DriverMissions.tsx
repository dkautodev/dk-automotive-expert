
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "../client/MissionStatusBadge";
import { Search, MapPin, Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DriverMissions = () => {
  const { user } = useAuthContext();
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
      setMissions(data || []);
    } catch (error) {
      console.error('Error fetching driver missions:', error);
      toast.error('Impossible de récupérer vos missions');
    } finally {
      setLoading(false);
    }
  };

  const updateMissionStatus = async (missionId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const { error } = await supabase
        .from('missions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', missionId);

      if (error) throw error;
      
      // Update mission in local state
      setMissions(prev => prev.map(mission => 
        mission.id === missionId ? { ...mission, status: newStatus } : mission
      ));
      
      toast.success('Statut de la mission mis à jour');
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Non spécifiée';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  const filteredMissions = missions.filter(mission => {
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    const matchesSearch = 
      searchQuery.trim() === '' || 
      (mission.mission_number && mission.mission_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mission.pickup_address && mission.pickup_address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mission.delivery_address && mission.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes missions</h1>
        <p className="text-muted-foreground">Gérez toutes vos missions assignées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des missions</CardTitle>
          <CardDescription>Visualisez et mettez à jour vos missions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une mission..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="prise_en_charge">En cours</SelectItem>
                <SelectItem value="livre">Livré</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader className="h-8 w-8" />
            </div>
          ) : filteredMissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Mission</TableHead>
                    <TableHead className="hidden md:table-cell">Adresse de départ</TableHead>
                    <TableHead className="hidden md:table-cell">Adresse de livraison</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMissions.map((mission) => (
                    <TableRow key={mission.id}>
                      <TableCell className="font-medium">{mission.mission_number || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{mission.pickup_address || 'Non spécifiée'}</TableCell>
                      <TableCell className="hidden md:table-cell">{mission.delivery_address || 'Non spécifiée'}</TableCell>
                      <TableCell>{formatDate(mission.created_at)}</TableCell>
                      <TableCell><MissionStatusBadge status={mission.status} /></TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedMission(mission)}
                            >
                              Détails
                            </Button>
                          </DialogTrigger>
                          {selectedMission && (
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Mission {selectedMission.mission_number || 'N/A'}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div>
                                  <h3 className="font-semibold mb-2">Informations générales</h3>
                                  <div className="space-y-2 bg-muted/50 rounded-md p-3">
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Adresse de départ</p>
                                        <p className="text-sm">{selectedMission.pickup_address || 'Non spécifiée'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Adresse de livraison</p>
                                        <p className="text-sm">{selectedMission.delivery_address || 'Non spécifiée'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Date de ramassage</p>
                                        <p className="text-sm">{formatDate(selectedMission.pickup_date)}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Heure de ramassage</p>
                                        <p className="text-sm">{selectedMission.pickup_time || 'Non spécifiée'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-2">État de la mission</h3>
                                  <div className="space-y-4 bg-muted/50 rounded-md p-3">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Statut actuel</p>
                                      <div className="mt-1">
                                        <MissionStatusBadge status={selectedMission.status} />
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Mettre à jour le statut</p>
                                      <Select
                                        onValueChange={(value) => updateMissionStatus(selectedMission.id, value)}
                                        disabled={updatingStatus}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Choisir un nouveau statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="prise_en_charge">En cours de livraison</SelectItem>
                                          <SelectItem value="livre">Livré</SelectItem>
                                          <SelectItem value="incident">Incident</SelectItem>
                                          <SelectItem value="termine">Terminé</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>

                                {selectedMission.vehicle_info && (
                                  <div className="md:col-span-2">
                                    <h3 className="font-semibold mb-2">Informations du véhicule</h3>
                                    <div className="bg-muted/50 rounded-md p-3">
                                      {typeof selectedMission.vehicle_info === 'object' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          <div>
                                            <p className="text-xs text-muted-foreground">Marque</p>
                                            <p className="text-sm">{(selectedMission.vehicle_info as any).brand || 'Non spécifiée'}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-muted-foreground">Modèle</p>
                                            <p className="text-sm">{(selectedMission.vehicle_info as any).model || 'Non spécifié'}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-muted-foreground">Immatriculation</p>
                                            <p className="text-sm">{(selectedMission.vehicle_info as any).licensePlate || 'Non spécifiée'}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune mission ne correspond à vos critères</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverMissions;
