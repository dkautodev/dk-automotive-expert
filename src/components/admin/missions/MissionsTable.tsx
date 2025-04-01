
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MissionsTableProps {
  missions: MissionRow[];
  onMissionCancelled?: () => void;
}

export const MissionsTable: React.FC<MissionsTableProps> = ({ missions, onMissionCancelled }) => {
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour extraire le code postal et la ville
  const extractPostalCodeAndCity = (address: string | undefined) => {
    if (!address) return "Non spécifié";
    
    // Recherche du code postal (5 chiffres en France)
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    
    if (!postalCodeMatch) return address.substring(0, 25) + "...";
    
    // Index du code postal
    const postalCodeIndex = address.indexOf(postalCodeMatch[0]);
    
    // Extrait une partie de l'adresse à partir du code postal
    const relevantPart = address.substring(postalCodeIndex);
    
    // Divise en mots pour trouver la ville après le code postal
    const parts = relevantPart.split(' ');
    
    if (parts.length > 1) {
      // Code postal + prochain mot (généralement la ville)
      return `${postalCodeMatch[0]} ${parts.slice(1, 3).join(' ')}`;
    }
    
    // Retourne uniquement le code postal si la ville ne peut pas être extraite
    return postalCodeMatch[0];
  };

  const handleViewDetails = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleCancelMission = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelMission = async () => {
    if (!selectedMission) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('missions')
        .update({ status: 'annulé' })
        .eq('id', selectedMission.id);
        
      if (error) {
        console.error("Error cancelling mission:", error);
        throw error;
      }
      
      toast.success(`La mission ${selectedMission.mission_number} a été annulée`);
      
      if (onMissionCancelled) {
        onMissionCancelled();
      }
    } catch (error) {
      console.error("Error cancelling mission:", error);
      toast.error("Erreur lors de l'annulation de la mission");
    } finally {
      setIsLoading(false);
      setIsCancelDialogOpen(false);
      setSelectedMission(null);
    }
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
                      onClick={() => handleCancelMission(mission)}
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
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation d'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la mission {selectedMission?.mission_number} ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelMission} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? 'Annulation en cours...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
