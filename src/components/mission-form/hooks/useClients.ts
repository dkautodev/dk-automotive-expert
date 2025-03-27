
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client, ClientFromDB } from "../types";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "../missionFormSchema";

export const useClients = (form?: UseFormReturn<MissionFormValues>) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email:user_id(email), phone")
        .eq("user_type", "client");

      if (error) throw error;

      // Transformation explicite des données pour éviter les problèmes de typage
      const formattedClients: Client[] = [];
      
      if (data) {
        // Utilisation d'une boucle simple pour éviter les problèmes de typage complexe
        for (let i = 0; i < data.length; i++) {
          const client = data[i] as unknown as ClientFromDB;
          formattedClients.push({
            id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email?.email || "",
            phone: client.phone || ""
          });
        }
      }

      setClients(formattedClients);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast.error(`Erreur lors du chargement des clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async () => {
    if (!newClient.first_name || !newClient.last_name || !newClient.email || !newClient.phone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a temporary password for the new client
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // First create the auth user
      const { data: userData, error: userError } = await supabase.functions.invoke('register-client', {
        body: {
          email: newClient.email,
          password: tempPassword,
          first_name: newClient.first_name,
          last_name: newClient.last_name,
          phone: newClient.phone,
        }
      });

      if (userError) throw userError;

      toast.success(`Client ${newClient.first_name} ${newClient.last_name} créé avec succès`);
      
      // Refresh the clients list
      fetchClients();

      // If a client was just created, select them automatically
      if (form && userData?.id) {
        form.setValue("client_id", userData.id);
      }

      // Reset the form
      setNewClient({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      
      return userData?.id;
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(`Erreur lors de la création du client: ${error.message}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    isSubmitting,
    newClient,
    setNewClient,
    fetchClients,
    createClient
  };
};
