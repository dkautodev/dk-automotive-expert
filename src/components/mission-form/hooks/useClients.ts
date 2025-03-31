
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ClientData, NewClientData } from './types/clientTypes';
import { clientService } from './services/clientService';

export type { ClientData, NewClientData } from './types/clientTypes';

/**
 * Hook for managing clients in the application
 */
export const useClients = (form?: any) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [newClient, setNewClient] = useState<NewClientData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  /**
   * Fetches clients from the backend
   */
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Début de la récupération des clients");
      const { clients: fetchedClients, error: fetchError } = await clientService.fetchClientsData();
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
  }, []);

  /**
   * Creates a new client based on form data
   */
  const createClient = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Vérification des données minimales requises
      if (!newClient.first_name || !newClient.last_name) {
        toast.error('Veuillez saisir au moins un prénom et un nom');
        return false;
      }
      
      console.log("Tentative de création d'un client:", newClient);
      const clientId = await clientService.addClientData(newClient);
      
      if (clientId) {
        toast.success('Client créé avec succès');
        
        // Créer un nouvel objet client à partir des données du formulaire
        const newClientDisplay: ClientData = {
          id: clientId,
          name: `${newClient.first_name} ${newClient.last_name}${newClient.company ? ` - ${newClient.company}` : ''}`.trim(),
          email: newClient.email,
          phone: newClient.phone,
          company: newClient.company
        };
        
        // Ajouter le client à la liste et mettre à jour le formulaire
        setClients(prev => [...prev, newClientDisplay]);
        if (form) {
          form.setValue('client_id', clientId);
        }
        
        // Réinitialiser le formulaire de création de client
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

  // Première récupération des clients
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Si erreur de chargement des clients ou aucun client, forcer une nouvelle tentative
  useEffect(() => {
    if ((error || (clients.length === 0 && !isLoading)) && retryCount < 3) {
      console.log(`Nouvelle tentative de récupération des clients (${retryCount + 1}/3)...`);
      const timer = setTimeout(() => {
        setRetryCount(prevCount => prevCount + 1);
        fetchClients();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, clients.length, isLoading, retryCount, fetchClients]);

  // Debug logging
  useEffect(() => {
    console.log("État actuel des clients:", clients);
  }, [clients]);

  return { 
    clients, 
    isLoading, 
    error, 
    fetchClients, 
    addClient: clientService.addClientData,
    newClient,
    setNewClient,
    createClient,
    isSubmitting
  };
};
