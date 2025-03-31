
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
    console.log("Mission créée avec succès, notification du parent");
    if (onMissionCreated) {
      onMissionCreated();
    }
    toast.success("Mission créée avec succès");
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
        <CreateMissionForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionDialog;
