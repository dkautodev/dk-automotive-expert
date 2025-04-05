
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface AssignDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  missionNumber: string | null;
  onDriverAssigned: () => void;
}

interface DriverProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
}

export const AssignDriverDialog: React.FC<AssignDriverDialogProps> = ({
  isOpen,
  onClose,
  missionId,
  missionNumber,
  onDriverAssigned
}) => {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsFetching(true);
      try {
        // Get users with chauffeur role
        const { data: users, error } = await supabase
          .from('users')
          .select('id, email')
          .eq('user_type', 'chauffeur');

        if (error) throw error;

        if (users && users.length > 0) {
          // Get driver profiles
          const userIds = users.map(user => user.id);
          const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', userIds);

          if (profilesError) throw profilesError;

          setDrivers(profiles || []);
        } else {
          setDrivers([]);
        }
      } catch (error: any) {
        console.error("Error fetching drivers:", error.message);
        toast.error("Erreur lors de la récupération des chauffeurs");
      } finally {
        setIsFetching(false);
      }
    };

    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const handleAssignDriver = async () => {
    if (!selectedDriverId || !missionId) {
      toast.error("Veuillez sélectionner un chauffeur");
      return;
    }

    setIsLoading(true);
    try {
      // Update mission with selected driver
      const { error } = await supabase
        .from('missions')
        .update({
          driver_id: selectedDriverId,
          status: 'prise_en_charge' // Update status to "prise en charge"
        })
        .eq('id', missionId);

      if (error) throw error;

      toast.success(`Mission ${missionNumber} assignée au chauffeur`);
      onDriverAssigned();
      onClose();
    } catch (error: any) {
      console.error("Error assigning driver:", error.message);
      toast.error("Erreur lors de l'assignation du chauffeur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner un chauffeur à la mission {missionNumber}</DialogTitle>
        </DialogHeader>
        
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader className="h-6 w-6" />
          </div>
        ) : drivers.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            Aucun chauffeur disponible. Veuillez ajouter des chauffeurs au système.
          </div>
        ) : (
          <div className="py-4">
            <Select 
              onValueChange={setSelectedDriverId} 
              value={selectedDriverId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un chauffeur" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.user_id} value={driver.user_id}>
                    {`${driver.first_name} ${driver.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleAssignDriver} 
            disabled={!selectedDriverId || isLoading}
          >
            {isLoading ? <Loader className="mr-2 h-4 w-4" /> : null}
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
