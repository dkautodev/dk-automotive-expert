
// Mise à jour du composant ContactSelector en supprimant "Sélectionner un contact"
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Contact } from "@/types/addressBook";
import { Check, User } from "lucide-react";

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onContactSelect: (contactId: string) => void;
  isLoading?: boolean;
}

const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContactId,
  onContactSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full"></div>
          <p>Chargement des contacts...</p>
        </div>
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <User className="h-12 w-12 opacity-20" />
          <p>Aucun contact disponible</p>
          <p className="text-sm">Créez d'abord un contact</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4 space-y-2">
            {contacts.map((contact) => (
              <Button
                key={contact.id}
                variant={selectedContactId === contact.id ? "default" : "outline"}
                className="w-full justify-start h-auto py-3 overflow-hidden"
                onClick={() => onContactSelect(contact.id)}
              >
                <div className="flex items-center gap-3 w-full overflow-hidden">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="font-medium truncate">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {contact.email}
                    </div>
                  </div>
                  {selectedContactId === contact.id && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ContactSelector;
