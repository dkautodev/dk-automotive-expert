
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { MissionRow } from "@/types/database";
import { Paperclip, Car, PenLine, User } from "lucide-react";
import { MissionAttachmentsDialog } from "./MissionAttachmentsDialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

interface DriverProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
}

interface EditMissionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionRow | null;
  onMissionUpdated: () => void;
}

export const EditMissionDetailsDialog: React.FC<EditMissionDetailsDialogProps> = ({
  isOpen,
  onClose,
  mission,
  onMissionUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachmentsDialogOpen, setIsAttachmentsDialogOpen] = useState(false);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "driver">("details");
  
  const [pickupContact, setPickupContact] = useState<ContactInfo>(
    mission?.pickup_contact ? 
      { 
        firstName: (mission.pickup_contact as any)?.firstName || '',
        lastName: (mission.pickup_contact as any)?.lastName || '',
        phone: (mission.pickup_contact as any)?.phone || '',
        email: (mission.pickup_contact as any)?.email || ''
      } :
      { firstName: '', lastName: '', phone: '', email: '' }
  );
  
  const [deliveryContact, setDeliveryContact] = useState<ContactInfo>(
    mission?.delivery_contact ? 
      { 
        firstName: (mission.delivery_contact as any)?.firstName || '',
        lastName: (mission.delivery_contact as any)?.lastName || '',
        phone: (mission.delivery_contact as any)?.phone || '',
        email: (mission.delivery_contact as any)?.email || ''
      } :
      { firstName: '', lastName: '', phone: '', email: '' }
  );
  
  const [missionType, setMissionType] = useState<"livraison" | "restitution">(
    mission?.mission_type || "livraison"
  );
  const [vehicleInfo, setVehicleInfo] = useState({
    brand: (mission?.vehicle_info as any)?.brand || '',
    model: (mission?.vehicle_info as any)?.model || '',
    licensePlate: (mission?.vehicle_info as any)?.licensePlate || '',
    year: (mission?.vehicle_info as any)?.year || '',
    fuel: (mission?.vehicle_info as any)?.fuel || '',
  });
  const [pickupDate, setPickupDate] = useState(mission?.pickup_date || '');
  const [pickupTime, setPickupTime] = useState(mission?.pickup_time || '');
  const [deliveryDate, setDeliveryDate] = useState(mission?.delivery_date || '');
  const [deliveryTime, setDeliveryTime] = useState(mission?.delivery_time || '');
  const [additionalInfo, setAdditionalInfo] = useState(mission?.additional_info || '');

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
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
        setIsLoadingDrivers(false);
      }
    };

    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  // Update state when mission changes
  useEffect(() => {
    if (mission) {
      // Gérer la compatibilité avec l'ancien format (name) et le nouveau format (firstName, lastName)
      let pickupFirstName = '';
      let pickupLastName = '';
      let deliveryFirstName = '';
      let deliveryLastName = '';
      
      if ((mission.pickup_contact as any)?.name) {
        // Ancien format avec un seul champ "name"
        const fullName = (mission.pickup_contact as any)?.name || '';
        const nameParts = fullName.split(' ');
        pickupFirstName = nameParts[0] || '';
        pickupLastName = nameParts.slice(1).join(' ') || '';
      } else {
        // Nouveau format avec firstName et lastName séparés
        pickupFirstName = (mission.pickup_contact as any)?.firstName || '';
        pickupLastName = (mission.pickup_contact as any)?.lastName || '';
      }
      
      if ((mission.delivery_contact as any)?.name) {
        // Ancien format avec un seul champ "name"
        const fullName = (mission.delivery_contact as any)?.name || '';
        const nameParts = fullName.split(' ');
        deliveryFirstName = nameParts[0] || '';
        deliveryLastName = nameParts.slice(1).join(' ') || '';
      } else {
        // Nouveau format avec firstName et lastName séparés
        deliveryFirstName = (mission.delivery_contact as any)?.firstName || '';
        deliveryLastName = (mission.delivery_contact as any)?.lastName || '';
      }
      
      setPickupContact({ 
        firstName: pickupFirstName,
        lastName: pickupLastName,
        phone: (mission.pickup_contact as any)?.phone || '',
        email: (mission.pickup_contact as any)?.email || ''
      });
      
      setDeliveryContact({ 
        firstName: deliveryFirstName,
        lastName: deliveryLastName,
        phone: (mission.delivery_contact as any)?.phone || '',
        email: (mission.delivery_contact as any)?.email || ''
      });
      
      setMissionType(mission.mission_type);
      setVehicleInfo({
        brand: (mission.vehicle_info as any)?.brand || '',
        model: (mission.vehicle_info as any)?.model || '',
        licensePlate: (mission.vehicle_info as any)?.licensePlate || '',
        year: (mission.vehicle_info as any)?.year || '',
        fuel: (mission.vehicle_info as any)?.fuel || '',
      });
      setPickupDate(mission.pickup_date || '');
      setPickupTime(mission.pickup_time || '');
      setDeliveryDate(mission.delivery_date || '');
      setDeliveryTime(mission.delivery_time || '');
      setAdditionalInfo(mission.additional_info || '');
      setSelectedDriverId(mission.driver_id || '');
    }
  }, [mission]);

  const handleSubmit = async () => {
    if (!mission) return;
    
    setIsLoading(true);
    try {
      // Format dates to ISO strings
      const formattedPickupDate = pickupDate ? new Date(pickupDate).toISOString() : null;
      const formattedDeliveryDate = deliveryDate ? new Date(deliveryDate).toISOString() : null;
      
      const { error } = await supabase
        .from('missions')
        .update({
          mission_type: missionType,
          vehicle_info: {
            brand: vehicleInfo.brand,
            model: vehicleInfo.model,
            licensePlate: vehicleInfo.licensePlate,
            year: vehicleInfo.year,
            fuel: vehicleInfo.fuel,
          },
          pickup_contact: {
            firstName: pickupContact.firstName,
            lastName: pickupContact.lastName,
            phone: pickupContact.phone,
            email: pickupContact.email,
          },
          delivery_contact: {
            firstName: deliveryContact.firstName,
            lastName: deliveryContact.lastName,
            phone: deliveryContact.phone,
            email: deliveryContact.email,
          },
          pickup_date: formattedPickupDate,
          pickup_time: pickupTime,
          delivery_date: formattedDeliveryDate,
          delivery_time: deliveryTime,
          additional_info: additionalInfo,
          updated_at: new Date().toISOString()
        })
        .eq('id', mission.id);

      if (error) throw error;

      toast.success("Détails de la mission mis à jour avec succès");
      onMissionUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating mission details:", error.message);
      toast.error("Erreur lors de la mise à jour des détails de la mission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!mission) return;
    if (!selectedDriverId) {
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
          status: 'prise_en_charge', // Update status to "prise en charge"
          updated_at: new Date().toISOString()
        })
        .eq('id', mission.id);

      if (error) throw error;

      toast.success(`Mission ${mission.mission_number} assignée au chauffeur`);
      onMissionUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error assigning driver:", error.message);
      toast.error("Erreur lors de l'assignation du chauffeur");
    } finally {
      setIsLoading(false);
    }
  };

  const openAttachmentsDialog = () => {
    setIsAttachmentsDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la mission {mission?.mission_number}</DialogTitle>
            <div className="flex mt-4 border-b">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "details" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Détails
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "driver" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setActiveTab("driver")}
              >
                Assignation Chauffeur
              </button>
            </div>
          </DialogHeader>
          
          {activeTab === "details" ? (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Type de mission</h3>
                <Select 
                  value={missionType} 
                  onValueChange={(value) => setMissionType(value as "livraison" | "restitution")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de mission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="livraison">Livraison</SelectItem>
                    <SelectItem value="restitution">Restitution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Informations véhicule</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      value={vehicleInfo.brand}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      value={vehicleInfo.model}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license-plate">Immatriculation</Label>
                    <Input
                      id="license-plate"
                      value={vehicleInfo.licensePlate}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, licensePlate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Année</Label>
                    <Input
                      id="year"
                      value={vehicleInfo.year}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="fuel">Carburant</Label>
                    <Select
                      value={vehicleInfo.fuel}
                      onValueChange={(value) => setVehicleInfo({...vehicleInfo, fuel: value})}
                    >
                      <SelectTrigger id="fuel">
                        <SelectValue placeholder="Sélectionner un type de carburant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Essence">Essence</SelectItem>
                        <SelectItem value="Électrique">Électrique</SelectItem>
                        <SelectItem value="Hybride">Hybride</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact de départ</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="pickup-firstname">Prénom</Label>
                    <Input
                      id="pickup-firstname"
                      value={pickupContact.firstName}
                      onChange={(e) => setPickupContact({...pickupContact, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-lastname">Nom</Label>
                    <Input
                      id="pickup-lastname"
                      value={pickupContact.lastName}
                      onChange={(e) => setPickupContact({...pickupContact, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-phone">Téléphone</Label>
                    <Input
                      id="pickup-phone"
                      value={pickupContact.phone}
                      onChange={(e) => setPickupContact({...pickupContact, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-email">Email</Label>
                    <Input
                      id="pickup-email"
                      value={pickupContact.email || ''}
                      onChange={(e) => setPickupContact({...pickupContact, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact de livraison</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="delivery-firstname">Prénom</Label>
                    <Input
                      id="delivery-firstname"
                      value={deliveryContact.firstName}
                      onChange={(e) => setDeliveryContact({...deliveryContact, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-lastname">Nom</Label>
                    <Input
                      id="delivery-lastname"
                      value={deliveryContact.lastName}
                      onChange={(e) => setDeliveryContact({...deliveryContact, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-phone">Téléphone</Label>
                    <Input
                      id="delivery-phone"
                      value={deliveryContact.phone}
                      onChange={(e) => setDeliveryContact({...deliveryContact, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-email">Email</Label>
                    <Input
                      id="delivery-email"
                      value={deliveryContact.email || ''}
                      onChange={(e) => setDeliveryContact({...deliveryContact, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Dates et heures</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="pickup-date">Date de départ</Label>
                    <Input
                      id="pickup-date"
                      type="date"
                      value={pickupDate ? new Date(pickupDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-time">Heure de départ</Label>
                    <Input
                      id="pickup-time"
                      type="time"
                      value={pickupTime || ''}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-date">Date de livraison</Label>
                    <Input
                      id="delivery-date"
                      type="date"
                      value={deliveryDate ? new Date(deliveryDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-time">Heure de livraison</Label>
                    <Input
                      id="delivery-time"
                      type="time"
                      value={deliveryTime || ''}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-info">Informations supplémentaires</Label>
                <Textarea
                  id="additional-info"
                  value={additionalInfo || ''}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Assignation de chauffeur</h3>
                
                {isLoadingDrivers ? (
                  <div className="flex justify-center py-4">
                    <Loader className="h-6 w-6" />
                  </div>
                ) : drivers.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucun chauffeur disponible. Veuillez ajouter des chauffeurs au système.
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={openAttachmentsDialog}
              type="button"
              className="flex items-center gap-1"
            >
              <Paperclip className="h-4 w-4" />
              Pièces jointes
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              {activeTab === "details" ? (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <Loader className="mr-2 h-4 w-4" /> : null}
                  Enregistrer
                </Button>
              ) : (
                <Button onClick={handleAssignDriver} disabled={isLoading || !selectedDriverId}>
                  {isLoading ? <Loader className="mr-2 h-4 w-4" /> : null}
                  Assigner
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {mission && (
        <MissionAttachmentsDialog
          isOpen={isAttachmentsDialogOpen}
          onClose={() => setIsAttachmentsDialogOpen(false)}
          missionId={mission.id}
          missionNumber={mission.mission_number}
        />
      )}
    </>
  );
};
