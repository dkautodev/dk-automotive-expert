import { useEffect, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { ClientData } from "./hooks/useClients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface ClientSelectorProps {
  form: UseFormReturn<MissionFormValues>;
  clients: ClientData[];
  loading: boolean;
  onAddClient: () => void;
}
const ClientSelector = ({
  form,
  clients,
  loading,
  onAddClient
}: ClientSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredClients, setFilteredClients] = useState<ClientData[]>(clients);
  const clientId = form.watch("client_id");

  // Find the selected client name
  const selectedClient = clients.find(client => client.id === clientId);
  useEffect(() => {
    // Filter clients based on search value
    const filtered = clients.filter(client => {
      const lowerSearchValue = searchValue.toLowerCase();
      const name = (client.name || '').toLowerCase();
      const company = (client.company || '').toLowerCase();
      return name.includes(lowerSearchValue) || company.includes(lowerSearchValue);
    });
    setFilteredClients(filtered);
  }, [searchValue, clients]);
  console.log("Liste des clients dans ClientSelector:", clients);
  const handleSelectClient = (value: string) => {
    form.setValue("client_id", value);
    setOpen(false);
  };
  return;
};
export default ClientSelector;