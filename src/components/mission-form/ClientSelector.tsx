
import { useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { ClientDisplay } from "./hooks/useClients";

interface ClientSelectorProps {
  form: UseFormReturn<MissionFormValues>;
  clients: ClientDisplay[];
  loading: boolean;
  onAddClient: () => void;
}

const ClientSelector = ({ form, clients, loading, onAddClient }: ClientSelectorProps) => {
  const clientId = form.watch("client_id");

  useEffect(() => {
    // If there's only one client, auto-select it
    if (clients.length === 1 && !clientId) {
      form.setValue("client_id", clients[0].id);
    }
  }, [clients, clientId, form]);

  return (
    <FormItem className="flex-1">
      <FormLabel>Client</FormLabel>
      <FormControl>
        <Select
          disabled={loading}
          value={clientId}
          onValueChange={(value) => form.setValue("client_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Chargement...
                </SelectItem>
              ) : clients.length === 0 ? (
                <SelectItem value="empty" disabled>
                  Aucun client trouvé
                </SelectItem>
              ) : (
                <>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="add-client" className="text-primary font-medium">
                    + Ajouter un nouveau client
                  </SelectItem>
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ClientSelector;
