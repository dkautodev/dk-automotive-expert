
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { OrderState } from "@/types/order";
import { UnifiedOrderForm } from "@/components/unified-form/UnifiedOrderForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Footer from "@/components/Footer";
import { VehicleSelectionForm } from "@/components/quote-details/VehicleSelectionForm";
import { QuoteDetailsBanner } from "@/components/quote-details/QuoteDetailsBanner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const orderDetails = location.state as OrderState | null;
  const [quoteNumber, setQuoteNumber] = useState<string>("");

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  const handleFormSubmit = async (formData: OrderState) => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour soumettre un devis",
          variant: "destructive"
        });
        return;
      }

      const quoteData = {
        user_id: user.id,
        pickup_address: formData.pickupAddress,
        delivery_address: formData.deliveryAddress,
        pickup_contact: JSON.parse(JSON.stringify(formData.pickupContact)),
        delivery_contact: JSON.parse(JSON.stringify(formData.deliveryContact)),
        pickup_date: formData.pickupDate.toISOString(),
        pickup_time: formData.pickupTime,
        delivery_date: formData.deliveryDate.toISOString(),
        delivery_time: formData.deliveryTime,
        distance: formData.distance.toString(),
        vehicles: JSON.parse(JSON.stringify(formData.vehicles)),
        total_price_ht: parseFloat(formData.priceHT),
        total_price_ttc: parseFloat(formData.priceHT) * 1.2,
        quote_number: quoteNumber,
        status: 'pending'
      };

      const { error } = await supabase
        .from('quotes')
        .insert(quoteData);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre devis a été enregistré avec succès",
      });

      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      console.error("Erreur lors de la soumission du devis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du devis",
        variant: "destructive"
      });
    }
  };

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
        
        <QuoteDetailsBanner 
          pickupAddress={orderDetails.pickupAddress}
          deliveryAddress={orderDetails.deliveryAddress}
          quoteNumber={quoteNumber}
          selectedVehicle={orderDetails.selectedVehicle}
        />
        <VehicleSelectionForm />
        <UnifiedOrderForm 
          orderDetails={orderDetails} 
          onQuoteNumberGenerated={setQuoteNumber}
          onSubmit={handleFormSubmit}
        />
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
