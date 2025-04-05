
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
    console.log("Mission créée avec succès via le dialogue, notification du parent");
    
    // Important: Notifier explicitement le parent pour forcer le rafraîchissement
    if (onMissionCreated) {
      setTimeout(() => {
        onMissionCreated();
        console.log("Callback onMissionCreated appelé avec délai");
      }, 500); // Petit délai pour permettre à la BD de se mettre à jour
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
