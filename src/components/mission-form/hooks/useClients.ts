
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ClientData, NewClientData } from './types/clientTypes';
import { clientService } from './services/clientService';
import { transformToClientDisplayList } from './utils/clientTransformers';

export type { ClientData, NewClientData } from './types/clientTypes';

/**
 * Hook for managing clients in the application
 */
export const useClients = (form?: any) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  // Transformer les clients en format d'affichage
  const clientDisplayList = transformToClientDisplayList(clients);

  return { 
    clients, 
    clientDisplayList,  // Ajout de la liste formatée
    isLoading, 
    error, 
    fetchClients
  };
};
