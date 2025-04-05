
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MissionRow } from "@/types/database";
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Clock, 
  Truck, 
  PackageCheck, 
  CheckSquare 
} from "lucide-react";
import { useStatusChange } from "@/hooks/useStatusChange";
import { toast } from "sonner";

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionRow | null;
  onStatusUpdated?: () => void;
}

export const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  isOpen,
  onClose,
  mission,
  onStatusUpdated
}) => {
  const { updateMissionStatus, isLoading } = useStatusChange({
    onSuccess: () => {
      if (onStatusUpdated) {
        onStatusUpdated();
      }
      onClose();
    }
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!mission || isLoading) return;
    
    try {
      await updateMissionStatus(mission.id, newStatus);
      toast.success(`Statut mis à jour: ${newStatus}`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (!mission) return null;

  // Déterminer quels statuts sont pertinents en fonction du statut actuel
  const getAvailableStatuses = () => {
    const currentStatus = mission.status;
    
    // Statuts de base disponibles dans la plupart des cas
    const statuses = [
      {
        id: "en_attente",
        label: "En attente",
        icon: <Clock className="h-5 w-5" />,
        color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        description: "Remettre en attente de confirmation"
      },
      {
        id: "confirme",
        label: "Confirmé",
        icon: <CheckCircle className="h-5 w-5" />,
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        description: "Confirmer le devis"
      },
      {
        id: "prise_en_charge",
        label: "En route",
        icon: <Truck className="h-5 w-5" />,
        color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        description: "Véhicule en cours de livraison"
      },
      {
        id: "livre",
        label: "Livré",
        icon: <PackageCheck className="h-5 w-5" />,
        color: "bg-green-100 text-green-700 hover:bg-green-200",
        description: "Véhicule livré au client"
      },
      {
        id: "termine",
        label: "Terminé",
        icon: <CheckSquare className="h-5 w-5" />,
        color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        description: "Mission complètement terminée"
      },
      {
        id: "incident",
        label: "Incident",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        description: "Signaler un problème lors de la livraison"
      },
      {
        id: "annule",
        label: "Annulé",
        icon: <X className="h-5 w-5" />,
        color: "bg-red-100 text-red-700 hover:bg-red-200",
        description: "Annuler définitivement la mission"
      }
    ];

    return statuses;
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mettre à jour le statut</DialogTitle>
          <DialogDescription>
            Mission {mission.mission_number || "Sans numéro"} - Statut actuel: <span className="font-medium">{mission.status}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-3 py-4">
          {availableStatuses.map((status) => (
            <Button
              key={status.id}
              variant="outline"
              className={`flex items-center justify-start gap-3 h-auto py-3 px-4 ${status.color} ${mission.status === status.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              onClick={() => handleStatusChange(status.id)}
              disabled={isLoading || mission.status === status.id}
            >
              <div className="flex-shrink-0">
                {status.icon}
              </div>
              <div className="text-left">
                <div className="font-medium">{status.label}</div>
                <div className="text-xs opacity-70">{status.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">Annuler</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
