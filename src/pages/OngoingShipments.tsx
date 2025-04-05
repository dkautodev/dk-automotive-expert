
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
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
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { useMissionCancellation } from "@/hooks/useMissionCancellation";
import { CancelMissionDialog } from "@/components/missions/CancelMissionDialog";

const OngoingShipments = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { 
    isCancelDialogOpen, 
    isLoading, 
    handleCancelMission, 
    confirmCancelMission, 
    setIsCancelDialogOpen,
    selectedMission: missionToCancel 
  } = useMissionCancellation({ 
    onSuccess: fetchOngoingMissions 
  });

  useEffect(() => {
    fetchOngoingMissions();
  }, [user?.id]);

  function fetchOngoingMissions() {
    if (!user?.id) return;
    
    setLoading(true);
    supabase
      .from('missions')
      .select('*, clientProfile:user_profiles(*)')
      .eq('client_id', user.id)
      .in('status', ['confirmé', 'confirme', 'prise_en_charge'])
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching ongoing missions:", error);
        } else if (data) {
          // Transform the data to ensure it matches the MissionRow type
          const transformedMissions: MissionRow[] = data.map(mission => ({
            ...mission,
            pickup_address: mission.pickup_address || 'Non spécifié',
            delivery_address: mission.delivery_address || 'Non spécifié',
            // Ensure clientProfile is properly cast
            clientProfile: mission.clientProfile || null
          })) as MissionRow[];
          
          setMissions(transformedMissions);
        }
        setLoading(false);
      });
  }

  const handleRowClick = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsOpen(true);
  };

  const confirmCancel = (mission: MissionRow, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    handleCancelMission(mission);
  };

  // Obtenir le code client ou un autre identifiant approprié
  const getClientIdentifier = (mission: MissionRow) => {
    if (mission.clientProfile && mission.clientProfile.client_code) {
      return mission.clientProfile.client_code;
    }
    
    return "Client";
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
      <CancelMissionDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancelMission}
        isLoading={isLoading}
        missionNumber={missionToCancel?.mission_number}
      />
    </div>
  );
};

export default OngoingShipments;
