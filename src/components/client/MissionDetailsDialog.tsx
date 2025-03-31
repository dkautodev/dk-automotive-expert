
import React from "react";
import { MissionRow } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la mission {mission.mission_number}</span>
            <Button 
              onClick={handleGeneratePDF} 
              variant="outline" 
              size="sm" 
              className="ml-2 flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </Button>
          </DialogTitle>
          <DialogDescription>
            Créée le {format(new Date(mission.created_at), "Pp", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Statut</h3>
              <MissionStatusBadge status={mission.status} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Type de mission</h3>
              <p>{mission.mission_type === "livraison" ? "Livraison" : "Restitution"}</p>
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

          <div className="space-y-2">
            <h3 className="font-semibold">Prix</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Prix HT</p>
                <p>{mission.price_ht ? `${mission.price_ht}€` : "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prix TTC</p>
                <p className="font-medium">
                  {mission.price_ttc ? `${mission.price_ttc}€` : "Non spécifié"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Dates</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Prise en charge</p>
                <p>{formatDate(mission.pickup_date)}</p>
                <p className="text-sm">{mission.pickup_time || ""}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Livraison</p>
                <p>{formatDate(mission.delivery_date)}</p>
                <p className="text-sm">{mission.delivery_time || ""}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Adresses</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Adresse de départ</p>
                <p>{mission.pickup_address || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse de livraison</p>
                <p>{mission.delivery_address || "Non spécifié"}</p>
              </div>
            </div>
          </div>

          {mission.distance && (
            <div className="space-y-2">
              <h3 className="font-semibold">Distance</h3>
              <p>{mission.distance} km</p>
            </div>
          )}

          {mission.additional_info && (
            <div className="space-y-2">
              <h3 className="font-semibold">Informations supplémentaires</h3>
              <p>{mission.additional_info}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
