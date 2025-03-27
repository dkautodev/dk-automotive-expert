
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionFormValues } from "./missionFormSchema";
import ClientList from "./ClientList";
import NewClientForm from "./NewClientForm";
import { Client, ClientFromDB } from "./types";

interface ClientSelectorProps {
  form: UseFormReturn<MissionFormValues>;
}

const ClientSelector = ({ form }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email:user_id(email), phone")
        .eq("user_type", "client");

      if (error) throw error;

      // Convert the database response to our Client interface
      const formattedClients: Client[] = (data as ClientFromDB[]).map((client) => ({
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email?.email || "",
        phone: client.phone
      }));

      setClients(formattedClients);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast.error(`Erreur lors du chargement des clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
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
      setIsDialogOpen(false);
      fetchClients();

      // If a client was just created, select them automatically
      if (userData?.id) {
        form.setValue("client_id", userData.id);
      }

    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(`Erreur lors de la création du client: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <ClientList 
          form={form} 
          clients={clients} 
          loading={loading} 
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-1">
              <PlusCircle className="h-4 w-4" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <NewClientForm 
              newClient={newClient}
              setNewClient={setNewClient}
              handleCreateClient={handleCreateClient}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientSelector;
