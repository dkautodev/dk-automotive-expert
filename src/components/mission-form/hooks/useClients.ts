
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClientData, NewClientData } from '@/hooks/auth/types';

export const useClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Requête aux profils utilisateurs avec le type 'client'
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          company_name,
          phone,
          billing_address
        `)
        .order('company_name', { ascending: true });

      if (profilesError) {
        throw profilesError;
      }

      // Transformer les données pour le format ClientData
      const formattedClients: ClientData[] = userProfiles.map(profile => ({
        id: profile.user_id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: '', // Sera rempli plus tard
        phone: profile.phone || '',
        company: profile.company_name || '',
        address: profile.billing_address || ''
      }));

      setClients(formattedClients);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des clients:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (newClient: NewClientData): Promise<string | null> => {
    try {
      // Implémentation de l'ajout de client
      return null;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du client');
      return null;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, isLoading, error, fetchClients, addClient };
};
