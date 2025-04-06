
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
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

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
        <div className="space-y-4">
          <CreateMissionForm 
            onSuccess={handleSuccess} 
            clientDefaultStatus="en_attente"
            termsAccepted={acceptedTerms}
            onTermsChange={setAcceptedTerms}
          />
          
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox 
              id="terms-dialog" 
              checked={acceptedTerms} 
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms-dialog" className="text-sm text-gray-600 cursor-pointer">
              En cliquant sur "Créer la mission", vous reconnaissez avoir lu et accepté les{" "}
              <Link to="/cgv" target="_blank" className="text-blue-500 hover:underline">
                Conditions Générales de Vente
              </Link>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionButton;
