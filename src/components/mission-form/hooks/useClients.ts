
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Export these types so they can be imported in other files
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface NewClientData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
}

// For displaying clients in selectors
export interface ClientDisplay {
  id: string;
  name: string;
}

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
      
      // Get all profiles - we need to disable RLS for this query or make sure
      // we have the proper policy in place
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) {
        throw profilesError;
      }

      console.log("Raw user profiles from database:", userProfiles);

      if (!userProfiles || userProfiles.length === 0) {
        console.log("Aucun client trouvé dans la base de données");
        setClients([]);
        return;
      }

      // Transform the data to ClientData format
      const formattedClients: ClientData[] = userProfiles.map(profile => {
        const name = [
          profile.first_name || '',
          profile.last_name || '',
          profile.company_name ? `(${profile.company_name})` : ''
        ].filter(Boolean).join(' ');

        return {
          id: profile.user_id || profile.id,
          name: name.trim() || 'Client sans nom',
          email: '', // Will be filled if needed later
          phone: profile.phone || '',
          company: profile.company_name || '',
          address: profile.billing_address || ''
        };
      });

      console.log("Clients formatés:", formattedClients);
      setClients(formattedClients);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des clients:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (newClientData: NewClientData): Promise<string | null> => {
    try {
      // Implémentation de l'ajout de client
      return null;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du client');
      return null;
    }
  };

  const createClient = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Implémentation pour créer un client
      // Pour l'instant, on simule juste une réussite
      
      toast.success('Client créé avec succès');
      
      // Si un formulaire est fourni, mettre à jour la valeur
      if (form && newClient.first_name && newClient.last_name) {
        // Simulation d'un ID client
        const clientId = `client-${Date.now()}`;
        
        // Mise à jour de la liste des clients
        const newClientDisplay: ClientData = {
          id: clientId,
          name: `${newClient.first_name} ${newClient.last_name} - ${newClient.company || ''}`.trim(),
          email: newClient.email,
          phone: newClient.phone,
        };
        
        setClients(prev => [...prev, newClientDisplay]);
        
        // Mise à jour du formulaire
        form.setValue('client_id', clientId);
        
        // Réinitialiser le formulaire de nouveau client
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
