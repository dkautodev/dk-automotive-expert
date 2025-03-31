
import { useEffect, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { ClientData } from "./hooks/types/clientTypes";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
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

  const handleSelectClient = (value: string) => {
    form.setValue("client_id", value);
    setOpen(false);
  };

  return (
    <FormItem className="mb-4">
      <FormLabel>Client</FormLabel>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between ${!selectedClient ? "text-muted-foreground" : ""}`}
                disabled={loading}
              >
                {selectedClient ? selectedClient.name : "Rechercher un client..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput
                placeholder="Rechercher un client..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  {loading ? "Chargement des clients..." : "Aucun client trouvé"}
                </CommandEmpty>
                <CommandGroup>
                  {filteredClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.id}
                      onSelect={handleSelectClient}
                    >
                      <div className="flex flex-col">
                        <span>{client.name}</span>
                        {client.company && (
                          <span className="text-xs text-muted-foreground">{client.company}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button type="button" onClick={onAddClient} variant="ghost" className="px-3">
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ClientSelector;
