import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/utils/textFormatters";
import { Textarea } from "@/components/ui/textarea";

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

interface ContactsFormProps {
  onContactsValid: (isValid: boolean) => void;
  onShowVehicle: () => void;
  onContactsUpdate: (pickup: ContactInfo, delivery: ContactInfo) => void;
  initialPickupContact?: ContactInfo;
  initialDeliveryContact?: ContactInfo;
}

export const ContactsForm = ({
  onContactsValid,
  onShowVehicle,
  onContactsUpdate,
  initialPickupContact,
  initialDeliveryContact
}: ContactsFormProps) => {
  const [pickupContact, setPickupContact] = useState<ContactInfo>(initialPickupContact || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [deliveryContact, setDeliveryContact] = useState<ContactInfo>(initialDeliveryContact || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, contact: 'pickup' | 'delivery', field: 'firstName' | 'lastName') => {
    const value = capitalizeFirstLetter(e.target.value);
    if (contact === 'pickup') {
      setPickupContact(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setDeliveryContact(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  useEffect(() => {
    const isPickupEmailValid = validateEmail(pickupContact.email);
    const isPickupPhoneValid = validatePhone(pickupContact.phone);
    const isDeliveryEmailValid = validateEmail(deliveryContact.email);
    const isDeliveryPhoneValid = validatePhone(deliveryContact.phone);
    const isPickupValid = pickupContact.firstName && pickupContact.lastName && isPickupEmailValid && isPickupPhoneValid;
    const isDeliveryValid = deliveryContact.firstName && deliveryContact.lastName && isDeliveryEmailValid && isDeliveryPhoneValid;
    onContactsValid(isPickupValid && isDeliveryValid);
    if (isPickupValid && isDeliveryValid) {
      onContactsUpdate(pickupContact, deliveryContact);
    }
  }, [pickupContact, deliveryContact, onContactsValid, onContactsUpdate]);

  return <Card>
      <CardHeader>
        <CardTitle>Coordonnées de livraison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact départ</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pickup-lastName">Nom *</Label>
                <Input id="pickup-lastName" value={pickupContact.lastName} onChange={e => handleNameChange(e, 'pickup', 'lastName')} required />
              </div>
              <div>
                <Label htmlFor="pickup-firstName">Prénom *</Label>
                <Input id="pickup-firstName" value={pickupContact.firstName} onChange={e => handleNameChange(e, 'pickup', 'firstName')} required />
              </div>
              <div>
                <Label htmlFor="pickup-email">Adresse mail *</Label>
                <Input id="pickup-email" type="email" value={pickupContact.email} onChange={e => setPickupContact({
                ...pickupContact,
                email: e.target.value
              })} className={!validateEmail(pickupContact.email) && pickupContact.email ? "border-red-500" : ""} required />
                {!validateEmail(pickupContact.email) && pickupContact.email && <p className="text-red-500 text-sm mt-1">Format d'email invalide</p>}
              </div>
              <div>
                <Label htmlFor="pickup-phone">Téléphone *</Label>
                <Input id="pickup-phone" value={pickupContact.phone} onChange={e => setPickupContact({
                ...pickupContact,
                phone: e.target.value
              })} className={!validatePhone(pickupContact.phone) && pickupContact.phone ? "border-red-500" : ""} required />
                {!validatePhone(pickupContact.phone) && pickupContact.phone && <p className="text-red-500 text-sm mt-1">Format de téléphone invalide (ex: 0612345678 ou +33612345678)</p>}
              </div>
              <div>
                <Label htmlFor="pickup-message">Message complémentaire</Label>
                <Textarea 
                  id="pickup-message" 
                  value={pickupContact.message} 
                  onChange={e => setPickupContact({
                    ...pickupContact,
                    message: e.target.value.slice(0, 60)
                  })}
                  placeholder="Ajoutez un message (60 caractères max)"
                  maxLength={60}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(pickupContact.message?.length || 0)}/60 caractères
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact livraison</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery-lastName">Nom *</Label>
                <Input id="delivery-lastName" value={deliveryContact.lastName} onChange={e => handleNameChange(e, 'delivery', 'lastName')} required />
              </div>
              <div>
                <Label htmlFor="delivery-firstName">Prénom *</Label>
                <Input id="delivery-firstName" value={deliveryContact.firstName} onChange={e => handleNameChange(e, 'delivery', 'firstName')} required />
              </div>
              <div>
                <Label htmlFor="delivery-email">Adresse mail *</Label>
                <Input id="delivery-email" type="email" value={deliveryContact.email} onChange={e => setDeliveryContact({
                ...deliveryContact,
                email: e.target.value
              })} className={!validateEmail(deliveryContact.email) && deliveryContact.email ? "border-red-500" : ""} required />
                {!validateEmail(deliveryContact.email) && deliveryContact.email && <p className="text-red-500 text-sm mt-1">Format d'email invalide</p>}
              </div>
              <div>
                <Label htmlFor="delivery-phone">Téléphone *</Label>
                <Input id="delivery-phone" value={deliveryContact.phone} onChange={e => setDeliveryContact({
                ...deliveryContact,
                phone: e.target.value
              })} className={!validatePhone(deliveryContact.phone) && deliveryContact.phone ? "border-red-500" : ""} required />
                {!validatePhone(deliveryContact.phone) && deliveryContact.phone && <p className="text-red-500 text-sm mt-1">Format de téléphone invalide (ex: 0612345678 ou +33612345678)</p>}
              </div>
              <div>
                <Label htmlFor="delivery-message">Message complémentaire</Label>
                <Textarea 
                  id="delivery-message" 
                  value={deliveryContact.message} 
                  onChange={e => setDeliveryContact({
                    ...deliveryContact,
                    message: e.target.value.slice(0, 60)
                  })}
                  placeholder="Ajoutez un message (60 caractères max)"
                  maxLength={60}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(deliveryContact.message?.length || 0)}/60 caractères
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onShowVehicle}>Ajouter le véhicule</Button>
        </div>
      </CardContent>
    </Card>;
};
