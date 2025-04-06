
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateMissionForm from "@/components/mission-form/CreateMissionForm";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateMissionButtonProps {
  onMissionCreated?: () => void;
}

const CreateMissionButton = ({ onMissionCreated }: CreateMissionButtonProps) => {
  const [open, setOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onMissionCreated) {
      onMissionCreated();
    }
    toast.success("Demande de devis envoyée avec succès");
    setAcceptedTerms(false); // Réinitialiser l'état pour la prochaine ouverture
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Demander un devis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demander un devis pour une mission de convoyage</DialogTitle>
        </DialogHeader>
        <CreateMissionForm 
          onSuccess={handleSuccess} 
          clientDefaultStatus="en_attente"
          termsAccepted={acceptedTerms}
          onTermsChange={setAcceptedTerms}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionButton;
