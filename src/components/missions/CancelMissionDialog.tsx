
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CancelMissionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  missionNumber?: string | null;
}

export const CancelMissionDialog: React.FC<CancelMissionDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  missionNumber
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation d'annulation</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir annuler {missionNumber ? `la mission ${missionNumber}` : 'cette mission'} ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }} 
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? 'Annulation en cours...' : 'Confirmer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
