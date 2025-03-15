
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const QuoteActions = () => {
  const navigate = useNavigate();

  const handleCancelQuote = () => {
    navigate("/dashboard/client");
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Annuler le devis
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Voulez-vous annuler le devis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les informations saisies seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, garder le devis</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelQuote}>
              Oui, annuler le devis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
