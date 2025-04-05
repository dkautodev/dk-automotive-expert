
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
import CreateMissionForm from "./CreateMissionForm";
import { toast } from "sonner";

interface CreateMissionDialogProps {
  onMissionCreated?: () => void;
}

const CreateMissionDialog = ({ onMissionCreated }: CreateMissionDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    
    // Log pour déboguer
    console.log("Mission créée avec succès via le dialogue, notification du parent", new Date().toISOString());
    
    // Important: Notifier explicitement le parent pour forcer le rafraîchissement
    if (onMissionCreated) {
      // Notification immédiate
      onMissionCreated();
      console.log("Callback onMissionCreated appelé immédiatement", new Date().toISOString());
      
      // Deuxième notification après un délai pour s'assurer de la mise à jour
      setTimeout(() => {
        onMissionCreated();
        console.log("Callback onMissionCreated appelé avec délai", new Date().toISOString());
      }, 1000); // Délai de 1000ms pour permettre à la BD de se mettre à jour
      
      // Troisième notification après un plus long délai
      setTimeout(() => {
        onMissionCreated();
        console.log("Callback onMissionCreated appelé avec délai plus long", new Date().toISOString());
      }, 3000); // Délai de 3000ms
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer une mission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle mission de convoyage</DialogTitle>
        </DialogHeader>
        <CreateMissionForm onSuccess={handleSuccess} clientDefaultStatus="confirmé" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionDialog;
