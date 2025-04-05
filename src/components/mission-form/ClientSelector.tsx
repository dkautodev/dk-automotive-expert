
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ClientData } from "./hooks/types/clientTypes";
import { MissionFormValues } from "./missionFormSchema";
import { useAuthContext } from "@/context/AuthContext";

interface ClientSelectorProps {
  form: UseFormReturn<MissionFormValues>;
  clients: ClientData[];
  loading: boolean;
}

const ClientSelector = ({ form, clients, loading }: ClientSelectorProps) => {
  const { role } = useAuthContext();
  
  // Si l'utilisateur est un client, ne pas afficher le sélecteur
  if (role === 'client') {
    return null;
  }
  
  console.log("Liste des clients disponibles:", clients);
  
  // Fonction pour formater l'affichage du client
  const formatClientDisplay = (client: ClientData) => {
    const nameParts = [];
    if (client.last_name) nameParts.push(client.last_name.toUpperCase());
    if (client.first_name) nameParts.push(client.first_name);
    if (client.company) nameParts.push(client.company);
    
    // Retourner le format NOM-PRENOM-SOCIÉTÉ si des informations sont disponibles
    return nameParts.length > 0 ? nameParts.join('-') : client.email || 'Client sans nom';
  };
  
  return (
    <FormField
      control={form.control}
      name="client_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sélectionner un client</FormLabel>
          <FormControl>
            <Select
              disabled={loading}
              value={field.value}
              onValueChange={(value) => {
                console.log("Client sélectionné:", value);
                field.onChange(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {formatClientDisplay(client)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ClientSelector;
