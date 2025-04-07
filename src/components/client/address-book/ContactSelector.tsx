
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ContactEntry } from "@/types/addressBook";
import { Check, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddressBook } from "@/hooks/useAddressBook";

interface ContactSelectorProps {
  contacts?: ContactEntry[];
  selectedContactId?: string | null;
  onContactSelect?: (contactId: string) => void;
  onSelectContact?: (contact: ContactEntry) => void;
  isLoading?: boolean;
  buttonClassName?: string;
}

const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts: providedContacts,
  selectedContactId = null,
  onContactSelect,
  onSelectContact,
  isLoading: providedIsLoading,
  buttonClassName = ""
}) => {
  const [open, setOpen] = useState(false);
  const [localContacts, setLocalContacts] = useState<ContactEntry[]>([]);
  
  // Use the addressBook hook if no contacts are provided
  const addressBook = useAddressBook();
  const fetchedContacts = addressBook.contacts || [];
  const fetchedIsLoading = addressBook.isLoading;
  
  // Use provided contacts/loading or fetch them via hook
  const contacts = providedContacts || fetchedContacts;
  const isLoading = providedIsLoading !== undefined ? providedIsLoading : fetchedIsLoading;
  
  // Update local contacts when contacts change
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setLocalContacts(contacts);
    }
  }, [contacts]);
  
  const handleContactClick = (contact: ContactEntry) => {
    if (onSelectContact) {
      onSelectContact(contact);
    }
    if (onContactSelect && contact.id) {
      onContactSelect(contact.id);
    }
    setOpen(false);
  };

  const renderContactsList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
          <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full"></div>
          <p>Chargement des contacts...</p>
        </div>
      );
    }

    // Safely check if localContacts exists and has a length
    const hasContacts = localContacts && localContacts.length > 0;

    if (!hasContacts) {
      return (
        <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
          <User className="h-12 w-12 opacity-20" />
          <p>Aucun contact disponible</p>
          <p className="text-sm">Créez d'abord un contact</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-2">
        {localContacts.map((contact) => (
          <Button
            key={contact.id}
            variant={selectedContactId === contact.id ? "default" : "outline"}
            className="w-full justify-start h-auto py-3 overflow-hidden"
            onClick={() => handleContactClick(contact)}
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={buttonClassName}>
          Choisir un contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Sélectionner un contact</DialogTitle>
        </DialogHeader>
        <Card className="h-[400px]">
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] w-full">
              {renderContactsList()}
            </ScrollArea>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSelector;
