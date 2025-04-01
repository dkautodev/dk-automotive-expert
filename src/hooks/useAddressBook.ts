
import { useState, useEffect } from 'react';
import { addressBookService } from '@/services/addressBookService';
import { ContactEntry, AddressBookState } from '@/types/addressBook';
import { toast } from 'sonner';
import { useAuthContext } from '@/context/AuthContext';

export const useAddressBook = () => {
  const [state, setState] = useState<AddressBookState>({
    contacts: [],
    isLoading: false,
    error: null,
  });
  const { user } = useAuthContext();

  const fetchContacts = async () => {
    if (!user) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const contacts = await addressBookService.getContacts();
      setState({
        contacts,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        contacts: [],
        isLoading: false,
        error: error.message || 'Failed to load contacts',
      });
      toast.error('Impossible de charger les contacts');
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const addContact = async (contact: Omit<ContactEntry, 'id'>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const newContact = await addressBookService.addContact(contact);
      setState(prev => ({
        ...prev,
        contacts: [...prev.contacts, newContact],
        isLoading: false,
      }));
      toast.success('Contact ajouté avec succès');
      return newContact;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      toast.error('Impossible d\'ajouter le contact');
      throw error;
    }
  };

  const updateContact = async (id: string, updates: Partial<Omit<ContactEntry, 'id'>>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const updatedContact = await addressBookService.updateContact(id, updates);
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.map(c => c.id === id ? updatedContact : c),
        isLoading: false,
      }));
      toast.success('Contact mis à jour avec succès');
      return updatedContact;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      toast.error('Impossible de mettre à jour le contact');
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await addressBookService.deleteContact(id);
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c.id !== id),
        isLoading: false,
      }));
      toast.success('Contact supprimé avec succès');
      return true;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      toast.error('Impossible de supprimer le contact');
      throw error;
    }
  };

  return {
    contacts: state.contacts,
    isLoading: state.isLoading,
    error: state.error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
  };
};
