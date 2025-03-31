
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ClientData, NewClientData } from './types/clientTypes';
import { fetchClientsData, addClientData } from './services/clientService';

export type { ClientData, NewClientData } from './types/clientTypes';

export const useClients = (form?: any) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState<NewClientData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Début de la récupération des clients");
      const { clients: fetchedClients, error: fetchError } = await fetchClientsData();
      console.log("Clients récupérés:", fetchedClients);
      
      if (fetchError) {
        setError(fetchError);
        toast.error('Erreur lors du chargement des clients');
        console.error("Erreur de récupération:", fetchError);
      } else {
        if (fetchedClients.length === 0) {
          console.log("Aucun client récupéré");
        }
        setClients(fetchedClients);
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des clients:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (newClientData: NewClientData): Promise<string | null> => {
    return await addClientData(newClientData);
  };

  const createClient = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Simulate client creation (retained from original)
      toast.success('Client créé avec succès');
      
      if (form && newClient.first_name && newClient.last_name) {
        const clientId = `client-${Date.now()}`;
        
        const newClientDisplay: ClientData = {
          id: clientId,
          name: `${newClient.first_name} ${newClient.last_name} - ${newClient.company || ''}`.trim(),
          email: newClient.email,
          phone: newClient.phone,
        };
        
        setClients(prev => [...prev, newClientDisplay]);
        form.setValue('client_id', clientId);
        
        setNewClient({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Erreur lors de la création du client:', error);
      toast.error(error.message || 'Erreur lors de la création du client');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    fetchClients, 
    addClient,
    newClient,
    setNewClient,
    createClient,
    isSubmitting
  };
};
