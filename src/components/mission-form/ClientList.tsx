
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
import { useAuthContext } from "@/context/AuthContext";

interface ClientListProps {
  form: UseFormReturn<MissionFormValues>;
  clients: ClientDisplay[];
  loading: boolean;
}

const ClientList = ({ form, clients, loading }: ClientListProps) => {
  const { role } = useAuthContext();
  
  // Fonction pour formater l'affichage du client
  // Le formatage est déjà géré dans le transformateur, mais on peut ajouter une logique supplémentaire ici si nécessaire
  const formatClientName = (name: string) => {
    return name;
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
