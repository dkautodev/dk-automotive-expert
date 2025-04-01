
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
import { formatCurrency } from "@/lib/utils";

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
  
  // Extract contact information
  const pickupContact = mission.pickup_contact as any || {};
  const deliveryContact = mission.delivery_contact as any || {};
  
  // Format prices to always show two decimal places
  const formattedPriceHT = mission.price_ht ? Number(mission.price_ht).toFixed(2) : null;
  const formattedPriceTTC = mission.price_ttc ? Number(mission.price_ttc).toFixed(2) : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Détails de la mission {mission.mission_number}
            </DialogTitle>
            <MissionStatusBadge status={mission.status} />
          </div>
          <DialogDescription>
            Créée le {format(new Date(mission.created_at), "Pp", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <p>{formatDate(mission.pickup_date)} {mission.pickup_time || ""}</p>
              
              <p className="text-sm text-muted-foreground mt-2">Adresse de départ</p>
              <p>{mission.pickup_address || "Non spécifié"}</p>
              
              {pickupContact && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p>{pickupContact.firstName || ""} {pickupContact.lastName || ""}</p>
                  {pickupContact.email && <p className="text-sm">{pickupContact.email}</p>}
                  {pickupContact.phone && <p className="text-sm">{pickupContact.phone}</p>}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Livraison</h3>
              <p>{formatDate(mission.delivery_date)} {mission.delivery_time || ""}</p>
              
              <p className="text-sm text-muted-foreground mt-2">Adresse de livraison</p>
              <p>{mission.delivery_address || "Non spécifié"}</p>
              
              {deliveryContact && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p>{deliveryContact.firstName || ""} {deliveryContact.lastName || ""}</p>
                  {deliveryContact.email && <p className="text-sm">{deliveryContact.email}</p>}
                  {deliveryContact.phone && <p className="text-sm">{deliveryContact.phone}</p>}
                </div>
              )}
            </div>
          </div>

          {mission.additional_info && (
            <div className="space-y-2">
              <h3 className="font-semibold">Informations supplémentaires</h3>
              <p>{mission.additional_info}</p>
            </div>
          )}
          
          <div className="mt-8 pt-5 border-t border-gray-200">
            <h3 className="font-semibold mb-3 border-b inline-block border-gray-400">Tarification</h3>
            <p className="text-sm">
              Prix total : {formattedPriceTTC ? `${formattedPriceTTC}€ TTC` : "Non spécifié"} 
              {formattedPriceHT ? ` soit ${formattedPriceHT}€ HT` : ""}
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
