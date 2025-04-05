
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientDisplay } from "./types";
import { MissionFormValues } from "./missionFormSchema";

interface ClientListProps {
  form: UseFormReturn<MissionFormValues>;
  clients: ClientDisplay[];
  loading: boolean;
}

const ClientList = ({ form, clients, loading }: ClientListProps) => {
  // Fonction pour formater l'affichage du client (si nécessaire)
  const formatClientName = (name: string) => {
    return name; // Le nom est déjà formaté comme NOM-PRENOM-SOCIÉTÉ dans les données
  };
  
  return (
    <FormField
      control={form.control}
      name="client_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={loading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {formatClientName(client.name)}
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

export default ClientList;
