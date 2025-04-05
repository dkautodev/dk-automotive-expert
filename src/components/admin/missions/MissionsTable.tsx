
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
import { 
  Eye, 
  X, 
  UserCheck, 
  Settings
} from "lucide-react";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { useMissionCancellation } from "@/hooks/useMissionCancellation";
import { CancelMissionDialog } from "@/components/missions/CancelMissionDialog";
import { extractPostalCodeAndCity } from "@/utils/addressUtils";
import { AssignDriverDialog } from "./AssignDriverDialog";
import { UpdateStatusDialog } from "./UpdateStatusDialog";

interface MissionsTableProps {
  missions: MissionRow[];
  onMissionCancelled?: () => void;
  onMissionUpdated?: () => void;
  displayType?: 'pending' | 'ongoing' | 'delivered' | 'incident' | 'completed' | 'default';
}

export const MissionsTable: React.FC<MissionsTableProps> = ({ 
  missions, 
  onMissionCancelled,
  onMissionUpdated,
  displayType = 'default'
}) => {
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [missionToAssign, setMissionToAssign] = useState<MissionRow | null>(null);
  
  const { 
    isCancelDialogOpen, 
    isLoading, 
    handleCancelMission, 
    confirmCancelMission, 
    setIsCancelDialogOpen,
    selectedMission: missionToCancel 
  } = useMissionCancellation({ onSuccess: onMissionCancelled });

  const handleViewDetails = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleAssignDriver = (mission: MissionRow) => {
    setMissionToAssign(mission);
    setIsAssignDriverDialogOpen(true);
  };

  const handleOpenStatusDialog = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsStatusDialogOpen(true);
  };

  const handleDriverAssigned = () => {
    // Trigger refresh of missions data
    if (onMissionUpdated) {
      onMissionUpdated();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  };

  const getClientName = (mission: MissionRow) => {
    const client = mission.clientProfile;
    if (!client) return "Non spécifié";
    
    // Priorité au code client s'il existe
    if (client.client_code && client.client_code.trim() !== "") {
      return client.client_code;
    }
    
    // Si pas de code client, utiliser le nom de la société
    if (client.company_name && client.company_name.trim() !== "") {
      return client.company_name;
    }
    
    // En dernier recours, utiliser le nom complet
    const fullName = `${client.first_name} ${client.last_name}`.trim();
    return fullName || "Non spécifié";
  };

  const getAddressDisplay = (mission: MissionRow, addressType: 'pickup' | 'delivery') => {
    // Utiliser les nouvelles colonnes structurées si disponibles
    if (addressType === 'pickup' && mission.city && mission.postal_code) {
      return `${mission.postal_code || ''} ${mission.city || ''}`.trim() || "Non spécifié";
    }
    
    // Sinon utiliser la méthode d'extraction existante
    const address = addressType === 'pickup' ? mission.pickup_address : mission.delivery_address;
    return extractPostalCodeAndCity(address) || "Non spécifié";
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
            const vehicleInfo = mission.vehicle_info as any || {};
            
            return (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">
                  {mission.mission_number || "Non attribué"}
                </TableCell>
                <TableCell>
                  {getClientName(mission)}
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
                  {getAddressDisplay(mission, 'pickup')}
                </TableCell>
                <TableCell title={mission.delivery_address}>
                  {extractPostalCodeAndCity(mission.delivery_address)}
                </TableCell>
                <TableCell>
                  <MissionStatusBadge status={mission.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {/* Bouton pour voir les détails - disponible pour tous les types */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(mission)}
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Bouton pour changer le statut - disponible pour tous les types */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100"
                      onClick={() => handleOpenStatusDialog(mission)}
                      title="Changer le statut"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    {/* Bouton d'assignation de chauffeur pour les missions confirmées */}
                    {(mission.status === 'confirmé' || mission.status === 'confirme') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        onClick={() => handleAssignDriver(mission)}
                        title="Assigner un chauffeur"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Bouton pour annuler - disponible pour la plupart des statuts */}
                    {mission.status !== 'termine' && mission.status !== 'annule' && mission.status !== 'annulé' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleCancelMission(mission)}
                        disabled={isLoading}
                        title="Annuler"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* Status Update Dialog */}
      <UpdateStatusDialog
        mission={selectedMission}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onStatusUpdated={onMissionUpdated}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelMissionDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancelMission}
        isLoading={isLoading}
        missionNumber={missionToCancel?.mission_number}
      />

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        isOpen={isAssignDriverDialogOpen}
        onClose={() => setIsAssignDriverDialogOpen(false)}
        missionId={missionToAssign?.id || null}
        missionNumber={missionToAssign?.mission_number || null}
        onDriverAssigned={handleDriverAssigned}
      />
    </>
  );
};
