
import React, { useState } from "react";
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
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { useMissionCancellation } from "@/hooks/useMissionCancellation";
import { CancelMissionDialog } from "@/components/missions/CancelMissionDialog";
import { Card } from "@/components/ui/card";
import { formatMissionClientName } from "@/utils/clientFormatter";

interface OngoingShipmentsTableProps {
  missions: MissionRow[];
  onRefresh: () => void;
}

export const OngoingShipmentsTable: React.FC<OngoingShipmentsTableProps> = ({ 
  missions,
  onRefresh
}) => {
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
    onSuccess: onRefresh 
  });

  const handleRowClick = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsOpen(true);
  };

  const confirmCancel = (mission: MissionRow, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    handleCancelMission(mission);
  };

  // Get client identifier with improved logic
  const getClientIdentifier = (mission: MissionRow) => {
    if (!mission.clientProfile) return "Client";
    
    // Priorité au code client s'il existe
    if (mission.clientProfile.client_code && mission.clientProfile.client_code.trim() !== "") {
      return mission.clientProfile.client_code;
    }
    
    // Ensuite, priorité au nom de la société
    if (mission.clientProfile.company_name && mission.clientProfile.company_name.trim() !== "") {
      return mission.clientProfile.company_name;
    }
    
    // En dernier recours, utiliser le nom et prénom
    const fullName = `${mission.clientProfile.first_name || ''} ${mission.clientProfile.last_name || ''}`.trim();
    return fullName || "Client";
  };

  return (
    <>
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
    </>
  );
};
