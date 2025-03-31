
import React from "react";
import { MissionRow } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";

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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la mission {mission.mission_number}</DialogTitle>
          <DialogDescription>
            Créée le {formatDate(mission.created_at)}
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
              {vehicleInfo.fuel_type ? ` - ${vehicleInfo.fuel_type}` : ""}
            </p>
            {vehicleInfo.license_plate && (
              <p>Immatriculation: {vehicleInfo.license_plate}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Prix</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Prix HT</p>
                <p>{mission.price_ht ? formatCurrency(mission.price_ht) : "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prix TTC</p>
                <p className="font-medium">
                  {mission.price_ttc ? formatCurrency(mission.price_ttc) : "Non spécifié"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Dates</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Prise en charge</p>
                <p>{mission.pickup_date ? formatDate(mission.pickup_date) : "Non spécifié"}</p>
                <p className="text-sm">{mission.pickup_time || ""}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Livraison</p>
                <p>{mission.delivery_date ? formatDate(mission.delivery_date) : "Non spécifié"}</p>
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
