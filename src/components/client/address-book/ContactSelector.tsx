
import { useState } from 'react';
import { useAddressBook } from '@/hooks/useAddressBook';
import { ContactEntry } from '@/types/addressBook';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SearchIcon, BookOpen } from 'lucide-react';
import ContactList from './ContactList';

interface ContactSelectorProps {
  contactType: 'pickup' | 'delivery' | 'all';
  onSelectContact: (contact: ContactEntry) => void;
  buttonClassName?: string;
}

const ContactSelector = ({ 
  contactType, 
  onSelectContact,
  buttonClassName = '',
}: ContactSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { contacts, isLoading } = useAddressBook();

  const filteredContacts = contacts.filter(contact => {
    // If contactType is 'all', show all contacts, otherwise filter by type
    const typeMatch = contactType === 'all' || contact.type === contactType;
    const searchMatch = 
      searchTerm === '' ||
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  const handleSelectContact = (contact: ContactEntry) => {
    onSelectContact(contact);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className={`flex items-center gap-2 ${buttonClassName}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Sélectionner un contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Carnet d'adresses</DialogTitle>
          <DialogDescription>
            Sélectionnez un contact pour remplir automatiquement les informations
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Rechercher un contact..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun contact trouvé</p>
          </div>
        ) : (
          <ContactList 
            contacts={filteredContacts} 
            onEdit={() => {}} 
            onDelete={() => {}}
            onFillForm={handleSelectContact}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactSelector;
