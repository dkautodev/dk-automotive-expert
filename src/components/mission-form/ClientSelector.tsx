
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionFormValues } from "./missionFormSchema";

// Define a clear interface for the client data we work with in the component
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Define a separate interface for the database response structure
interface ClientFromDB {
  id: string;
  first_name: string;
  last_name: string;
  email: {
    email: string;
  } | null;
  phone: string;
}

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

      // Format client data with email from the joined user table
      const formattedClients: Client[] = (data as ClientFromDB[]).map(client => ({
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
      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <div className="flex gap-2">
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name} - {client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="first_name">Prénom</FormLabel>
                        <Input
                          id="first_name"
                          value={newClient.first_name}
                          onChange={(e) => setNewClient({...newClient, first_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="last_name">Nom</FormLabel>
                        <Input
                          id="last_name"
                          value={newClient.last_name}
                          onChange={(e) => setNewClient({...newClient, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="phone">Téléphone</FormLabel>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateClient} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Créer le client
                      </>
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClientSelector;
