
import { Users, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactsForm } from "@/components/order/ContactsForm";
import { Contact } from "@/types/order";

interface ContactsSectionProps {
  pickupContact: Contact;
  deliveryContact: Contact;
  onContactsUpdate: (pickup: Contact, delivery: Contact) => void;
}

export const ContactsSection = ({ pickupContact, deliveryContact, onContactsUpdate }: ContactsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Contacts</h3>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserCog className="h-4 w-4" />
              Modifier les contacts
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier les contacts</DialogTitle>
            </DialogHeader>
            <ContactsForm
              onContactsValid={() => {}}
              onShowVehicle={() => {}}
              onContactsUpdate={onContactsUpdate}
              initialPickupContact={pickupContact}
              initialDeliveryContact={deliveryContact}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Contact départ</h4>
          <p>{pickupContact.firstName} {pickupContact.lastName}</p>
          <p>{pickupContact.email}</p>
          <p>{pickupContact.phone}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Contact livraison</h4>
          <p>{deliveryContact.firstName} {deliveryContact.lastName}</p>
          <p>{deliveryContact.email}</p>
          <p>{deliveryContact.phone}</p>
        </div>
      </div>
    </div>
  );
};
