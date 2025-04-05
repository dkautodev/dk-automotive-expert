
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { NewClientData } from "./hooks/types/clientTypes";

interface NewClientFormProps {
  newClient: NewClientData;
  setNewClient: React.Dispatch<React.SetStateAction<NewClientData>>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const NewClientForm = ({
  newClient,
  setNewClient,
  onSubmit,
  isSubmitting
}: NewClientFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="first_name">Prénom *</FormLabel>
          <Input
            id="first_name"
            name="first_name"
            value={newClient.first_name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <FormLabel htmlFor="last_name">Nom *</FormLabel>
          <Input
            id="last_name"
            name="last_name"
            value={newClient.last_name || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="email">Email *</FormLabel>
        <Input
          id="email"
          name="email"
          type="email"
          value={newClient.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="phone">Téléphone *</FormLabel>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={newClient.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            "Créer le client"
          )}
        </Button>
      </div>
    </div>
  );
};

export default NewClientForm;
