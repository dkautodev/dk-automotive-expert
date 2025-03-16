
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { OrderState } from "@/types/order";
import { UnifiedOrderForm } from "@/components/unified-form/UnifiedOrderForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Footer from "@/components/Footer";
import { VehicleSelectionForm } from "@/components/quote-details/VehicleSelectionForm";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderState | null;

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 flex-grow">
        <div className="flex flex-col items-center gap-4 py-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="self-start">
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
          <h1 className="text-3xl font-bold text-center">Complétez votre demande</h1>
        </div>
        
        <VehicleSelectionForm />
        <UnifiedOrderForm orderDetails={orderDetails} />
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
