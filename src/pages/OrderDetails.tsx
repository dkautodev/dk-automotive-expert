
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { OrderState } from "@/types/order";
import { UnifiedOrderForm } from "@/components/unified-form/UnifiedOrderForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderState | null;

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous êtes sur le point de supprimer votre devis et retourner au dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => navigate("/dashboard/client")}>
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button
            onClick={orderDetails.handleSubmit}
            disabled={!orderDetails.canSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Générer le devis
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8">Complétez votre demande</h1>
        <UnifiedOrderForm orderDetails={orderDetails} />
      </div>
    </div>
  );
};

export default OrderDetails;
