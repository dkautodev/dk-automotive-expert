
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { MissionRow } from "@/types/database";

interface ContactInfo {
  name: string;
  phone: string;
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
  
  const [pickupContact, setPickupContact] = useState<ContactInfo>(
    mission?.pickup_contact ? 
      { 
        name: (mission.pickup_contact as any)?.name || '',
        phone: (mission.pickup_contact as any)?.phone || ''
      } :
      { name: '', phone: '' }
  );
  
  const [deliveryContact, setDeliveryContact] = useState<ContactInfo>(
    mission?.delivery_contact ? 
      { 
        name: (mission.delivery_contact as any)?.name || '',
        phone: (mission.delivery_contact as any)?.phone || ''
      } :
      { name: '', phone: '' }
  );
  
  const [pickupDate, setPickupDate] = useState(mission?.pickup_date || '');
  const [pickupTime, setPickupTime] = useState(mission?.pickup_time || '');
  const [deliveryDate, setDeliveryDate] = useState(mission?.delivery_date || '');
  const [deliveryTime, setDeliveryTime] = useState(mission?.delivery_time || '');
  const [additionalInfo, setAdditionalInfo] = useState(mission?.additional_info || '');

  // Update state when mission changes
  React.useEffect(() => {
    if (mission) {
      setPickupContact({ 
        name: (mission.pickup_contact as any)?.name || '',
        phone: (mission.pickup_contact as any)?.phone || ''
      });
      
      setDeliveryContact({ 
        name: (mission.delivery_contact as any)?.name || '',
        phone: (mission.delivery_contact as any)?.phone || ''
      });
      
      setPickupDate(mission.pickup_date || '');
      setPickupTime(mission.pickup_time || '');
      setDeliveryDate(mission.delivery_date || '');
      setDeliveryTime(mission.delivery_time || '');
      setAdditionalInfo(mission.additional_info || '');
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
          pickup_contact: {
            name: pickupContact.name,
            phone: pickupContact.phone,
          },
          delivery_contact: {
            name: deliveryContact.name,
            phone: deliveryContact.phone,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier les détails de la mission</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contact de départ</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pickup-name">Nom</Label>
                <Input
                  id="pickup-name"
                  value={pickupContact.name}
                  onChange={(e) => setPickupContact({...pickupContact, name: e.target.value})}
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
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contact de livraison</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="delivery-name">Nom</Label>
                <Input
                  id="delivery-name"
                  value={deliveryContact.name}
                  onChange={(e) => setDeliveryContact({...deliveryContact, name: e.target.value})}
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader className="mr-2 h-4 w-4" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
