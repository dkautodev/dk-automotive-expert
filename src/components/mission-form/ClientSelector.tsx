
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MissionFormValues } from "./missionFormSchema";
import ClientList from "./ClientList";
import NewClientForm from "./NewClientForm";
import { useClients } from "./hooks/useClients";

interface ClientSelectorProps {
  form: UseFormReturn<MissionFormValues>;
}

const ClientSelector = ({ form }: ClientSelectorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    clients, 
    loading, 
    isSubmitting, 
    newClient, 
    setNewClient, 
    createClient 
  } = useClients(form);

  const handleCreateClient = async () => {
    const result = await createClient();
    if (result) {
      setIsDialogOpen(false);
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
