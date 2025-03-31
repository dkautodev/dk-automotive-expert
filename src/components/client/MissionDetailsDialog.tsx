
import React from "react";
import { MissionRow } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateMissionPDF } from "@/utils/missionPdfGenerator";

interface MissionDetailsDialogProps {
  mission: MissionRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MissionDetailsDialog: React.FC<MissionDetailsDialogProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  if (!mission) return null;

  const vehicleInfo = mission.vehicle_info as any || {};
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  };
  
  const handleGeneratePDF = () => {
    if (mission) {
      generateMissionPDF(mission);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Détails de la mission {mission.mission_number}
          </DialogTitle>
          <DialogDescription>
            Créée le {format(new Date(mission.created_at), "Pp", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Statut</h3>
              <MissionStatusBadge status={mission.status} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Type de mission</h3>
              <p>{mission.mission_type === "livraison" ? "Livraison" : "Restitution"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Distance</h3>
              <p>{mission.distance ? `${mission.distance} km` : "Non spécifiée"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Véhicule</h3>
            <p>
              {vehicleInfo.brand || "N/A"} {vehicleInfo.model || ""} {vehicleInfo.year || ""}
              {vehicleInfo.fuel ? ` - ${vehicleInfo.fuel}` : ""}
            </p>
            {vehicleInfo.licensePlate && (
              <p>Immatriculation: {vehicleInfo.licensePlate}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Prise en charge</h3>
              <p>{formatDate(mission.pickup_date)}</p>
              <p className="text-sm">{mission.pickup_time || ""}</p>
              <p className="text-sm text-muted-foreground mt-2">Adresse de départ</p>
              <p>{mission.pickup_address || "Non spécifié"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Livraison</h3>
              <p>{formatDate(mission.delivery_date)}</p>
              <p className="text-sm">{mission.delivery_time || ""}</p>
              <p className="text-sm text-muted-foreground mt-2">Adresse de livraison</p>
              <p>{mission.delivery_address || "Non spécifié"}</p>
            </div>
          </div>

          {mission.additional_info && (
            <div className="space-y-2">
              <h3 className="font-semibold">Informations supplémentaires</h3>
              <p>{mission.additional_info}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Tarification</h3>
            <p className="text-lg font-medium">
              Prix total : {mission.price_ttc ? `${mission.price_ttc}€ TTC` : "Non spécifié"} 
              {mission.price_ht ? ` soit ${mission.price_ht}€ HT` : ""}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleGeneratePDF} 
            variant="outline" 
            className="ml-auto flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>Générer PDF</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
