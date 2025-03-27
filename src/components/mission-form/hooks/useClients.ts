
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionFormValues } from "../missionFormSchema";
import { ClientDisplay } from "../types";

type NewClientData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export const useClients = (form: UseFormReturn<MissionFormValues>) => {
  const [clients, setClients] = useState<ClientDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState<NewClientData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, company_name')
        .eq('user_type', 'client');

      if (error) throw error;

      const formattedClients: ClientDisplay[] = data.map(client => ({
        id: client.id,
        name: `${client.first_name} ${client.last_name}${client.company_name ? ` (${client.company_name})` : ''}`
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!newClient.first_name || !newClient.last_name || !newClient.email) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return false;
      }

      // Insert the new client
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          first_name: newClient.first_name,
          last_name: newClient.last_name,
          email: newClient.email,
          phone: newClient.phone,
          user_type: 'client'
        })
        .select('id, first_name, last_name')
        .single();

      if (error) throw error;

      // Add new client to the list
      const newClientDisplay: ClientDisplay = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`
      };
      
      setClients([...clients, newClientDisplay]);
      
      // Set the client in the form
      form.setValue('client_id', data.id);
      
      // Reset form
      setNewClient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      });
      
      toast.success("Client créé avec succès");
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error("Erreur lors de la création du client");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    newClient,
    setNewClient,
    createClient,
    isSubmitting
  };
};
