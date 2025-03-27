
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface NewClientFormProps {
  newClient: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  setNewClient: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }>>;
  handleCreateClient: () => Promise<void>;
  isSubmitting: boolean;
}

const NewClientForm = ({ 
  newClient, 
  setNewClient, 
  handleCreateClient,
  isSubmitting 
}: NewClientFormProps) => {
  return (
    <>
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
    </>
  );
};

export default NewClientForm;
