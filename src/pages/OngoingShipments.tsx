
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";

const OngoingShipments = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [missionToCancel, setMissionToCancel] = useState<MissionRow | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOngoingMissions();
  }, [user?.id]);

  const fetchOngoingMissions = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', user.id)
        .in('status', ['confirmé', 'confirme', 'prise_en_charge'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMissions(data as MissionRow[] || []);
    } catch (err) {
      console.error("Error fetching ongoing missions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsOpen(true);
  };

  const handleCancelMission = async () => {
    if (!missionToCancel) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('missions')
        .update({ status: 'annulé' })
        .eq('id', missionToCancel.id);
      
      if (error) {
        console.error("Error cancelling mission:", error);
        throw error;
      }
      
      // Update local state to reflect the change
      setMissions(missions.filter(m => m.id !== missionToCancel.id));
      toast.success("Mission annulée avec succès");
      
      // Close dialog
      setMissionToCancel(null);
      setIsCancelDialogOpen(false);
    } catch (err) {
      console.error("Error cancelling mission:", err);
      toast.error("Erreur lors de l'annulation de la mission");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCancel = (mission: MissionRow, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setMissionToCancel(mission);
    setIsCancelDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Convoyages en cours</h1>
      <Card className="rounded-lg border">
        {missions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Date prise en charge</TableHead>
                <TableHead>Date livraison</TableHead>
                <TableHead>Adresses</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Prix TTC</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((mission) => {
                const vehicleInfo = mission.vehicle_info as any;
                
                return (
                  <TableRow 
                    key={mission.id} 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(mission)}
                  >
                    <TableCell className="font-medium">{mission.mission_number}</TableCell>
                    <TableCell>{formatDate(mission.created_at)}</TableCell>
                    <TableCell>{mission.pickup_date ? formatDate(mission.pickup_date) : "Non spécifié"}</TableCell>
                    <TableCell>{mission.delivery_date ? formatDate(mission.delivery_date) : "Non spécifié"}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-semibold">De: </span>
                          {mission.pickup_address || "Non spécifié"}
                        </div>
                        <div>
                          <span className="font-semibold">À: </span>
                          {mission.delivery_address || "Non spécifié"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicleInfo ? (
                        <span>
                          {vehicleInfo.brand} {vehicleInfo.model}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {mission.price_ttc ? formatCurrency(mission.price_ttc) : "Non spécifié"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MissionStatusBadge status={mission.status} />
                        {(mission.status === "confirme" || mission.status === "confirmé") && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => confirmCancel(mission, e)}
                            className="h-6 w-6"
                            disabled={isLoading}
                            title="Annuler la mission"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="p-4">Aucun convoyage en cours actuellement.</p>
        )}
      </Card>

      {/* Mission Details Dialog */}
      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette mission ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelMission} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? 'Annulation en cours...' : 'Confirmer l\'annulation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OngoingShipments;
