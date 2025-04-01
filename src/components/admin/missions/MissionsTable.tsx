
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { MissionRow } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { useMissionCancellation } from "@/hooks/useMissionCancellation";
import { CancelMissionDialog } from "@/components/missions/CancelMissionDialog";
import { extractPostalCodeAndCity } from "@/utils/addressUtils";

interface MissionsTableProps {
  missions: MissionRow[];
  onMissionCancelled?: () => void;
}

export const MissionsTable: React.FC<MissionsTableProps> = ({ 
  missions, 
  onMissionCancelled 
}) => {
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { 
    isCancelDialogOpen, 
    isLoading, 
    handleCancelMission, 
    confirmCancelMission, 
    setIsCancelDialogOpen 
  } = useMissionCancellation({ onSuccess: onMissionCancelled });

  const handleViewDetails = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Date de livraison</TableHead>
            <TableHead>Adresse départ</TableHead>
            <TableHead>Adresse livraison</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map((mission) => {
            const client = mission.clientProfile as any;
            const vehicleInfo = mission.vehicle_info as any || {};
            
            return (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">
                  {mission.mission_number || "Non attribué"}
                </TableCell>
                <TableCell>
                  {client?.company_name || `${client?.first_name || ''} ${client?.last_name || ''}` || "Non spécifié"}
                </TableCell>
                <TableCell>
                  {vehicleInfo ? (
                    <span>
                      {vehicleInfo.brand || ''} {vehicleInfo.model || ''}
                    </span>
                  ) : (
                    "Non spécifié"
                  )}
                </TableCell>
                <TableCell>{formatDate(mission.delivery_date)}</TableCell>
                <TableCell title={mission.pickup_address}>
                  {extractPostalCodeAndCity(mission.pickup_address)}
                </TableCell>
                <TableCell title={mission.delivery_address}>
                  {extractPostalCodeAndCity(mission.delivery_address)}
                </TableCell>
                <TableCell>
                  <MissionStatusBadge status={mission.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(mission)}
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleCancelMission(mission.id)}
                      disabled={isLoading}
                      title="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {missions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                Aucune mission disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Details Dialog */}
      <MissionDetailsDialog 
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelMissionDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancelMission}
        isLoading={isLoading}
        missionNumber={selectedMission?.mission_number}
      />
    </>
  );
};
