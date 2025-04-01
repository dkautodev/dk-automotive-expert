
import { useState } from 'react';
import { useAddressBook } from '@/hooks/useAddressBook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactEntry } from '@/types/addressBook';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';

const AddressBook = () => {
  const { contacts, isLoading, error, addContact, updateContact, deleteContact } = useAddressBook();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactEntry | null>(null);

  const filteredContacts = contacts.filter(contact => {
    return contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddContact = async (contact: Omit<ContactEntry, 'id'>) => {
    await addContact(contact);
    setIsAddingContact(false);
  };

  const handleUpdateContact = async (id: string, updates: Partial<Omit<ContactEntry, 'id'>>) => {
    await updateContact(id, updates);
    setEditingContact(null);
  };

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des contacts</p>
        <Button variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Carnet d'adresses</CardTitle>
            <Button 
              onClick={() => {
                setIsAddingContact(true);
                setEditingContact(null);
              }}
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>Nouveau contact</span>
            </Button>
          </div>
          <CardDescription>
            Gérez vos contacts pour un remplissage rapide des formulaires
          </CardDescription>

          <div className="relative mt-2">
            <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Rechercher un contact..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isAddingContact ? (
            <ContactForm 
              onCancel={() => setIsAddingContact(false)}
              onSubmit={handleAddContact}
            />
          ) : editingContact ? (
            <ContactForm 
              contact={editingContact}
              onCancel={() => setEditingContact(null)}
              onSubmit={(contact) => handleUpdateContact(editingContact.id, contact)}
            />
          ) : filteredContacts.length === 0 ? (
            <EmptyState 
              onAddContact={() => setIsAddingContact(true)}
              hasContacts={contacts.length > 0}
            />
          ) : (
            <ContactList 
              contacts={filteredContacts}
              onEdit={setEditingContact}
              onDelete={deleteContact}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressBook;
