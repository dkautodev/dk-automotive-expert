
import { useEffect, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { ClientData } from "./hooks/types/clientTypes";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Loader2 } from "lucide-react";
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
    // Debug logging
    console.log("Clients disponibles:", clients);
    console.log("Client sélectionné:", selectedClient);
    console.log("ClientId actuel:", clientId);
    
    // Filter clients based on search value
    const filtered = clients.filter(client => {
      if (!searchValue.trim()) return true;
      
      const lowerSearchValue = searchValue.toLowerCase().trim();
      const name = (client.name || '').toLowerCase();
      const email = (client.email || '').toLowerCase();
      const company = (client.company || '').toLowerCase();
      
      return name.includes(lowerSearchValue) || 
             email.includes(lowerSearchValue) || 
             company.includes(lowerSearchValue);
    });
    
    console.log("Clients filtrés:", filtered);
    setFilteredClients(filtered);
  }, [searchValue, clients, selectedClient, clientId]);

  const handleSelectClient = (value: string) => {
    console.log("Client sélectionné avec ID:", value);
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
                onClick={() => setOpen(true)}
                type="button"
              >
                {selectedClient ? selectedClient.name : "Rechercher un client..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Rechercher un client..."
                value={searchValue}
                onValueChange={setSearchValue}
                autoFocus
              />
              <CommandList>
                {loading ? (
                  <div className="py-6 text-center text-sm flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Chargement des clients...
                  </div>
                ) : (
                  <>
                    <CommandEmpty>
                      {searchValue.trim() 
                        ? "Aucun client trouvé" 
                        : clients.length === 0 
                          ? "Aucun client disponible, cliquez sur + pour en ajouter" 
                          : "Saisissez un terme de recherche"
                      }
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.id}
                            onSelect={() => handleSelectClient(client.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{client.name}</span>
                              {client.email && (
                                <span className="text-xs text-muted-foreground">{client.email}</span>
                              )}
                              {client.company && (
                                <span className="text-xs text-muted-foreground">{client.company}</span>
                              )}
                            </div>
                          </CommandItem>
                        ))
                      ) : !loading && (
                        <div className="py-6 text-center text-sm">
                          Aucun client à afficher
                        </div>
                      )}
                    </CommandGroup>
                  </>
                )}
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
