
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

interface CreateMissionButtonProps {
  onMissionCreated?: () => void;
}

const CreateMissionButton = ({ onMissionCreated }: CreateMissionButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onMissionCreated) {
      onMissionCreated();
    }
    toast.success("Demande de devis envoyée avec succès");
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
        <CreateMissionForm onSuccess={handleSuccess} clientDefaultStatus="en_attente" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionButton;
