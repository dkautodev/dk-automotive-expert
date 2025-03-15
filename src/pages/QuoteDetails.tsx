
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const QuoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { fetchQuoteById, deleteQuote } = useQuoteManagement();

  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => fetchQuoteById(id!),
  });

  const handleDeleteQuote = async () => {
    try {
      await deleteQuote(id!);
      await queryClient.invalidateQueries({ queryKey: ['pendingQuotes'] });
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès.",
      });
      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du devis.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Chargement des détails du devis...</div>;
  }

  if (!quote) {
    return <div className="p-6 text-center text-red-500">Devis non trouvé.</div>;
  }

  return (
    <div className="p-6">
      <div className="relative mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/client/pending-quotes")}
          className="absolute left-0 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux devis
        </Button>
        <h1 className="text-3xl font-bold text-center">Détails du devis</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Devis DEV-{quote.id}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-muted-foreground">
              {format(new Date(quote.dateCreated), 'dd MMMM yyyy', { locale: fr })}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteQuote}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Date et heure</h3>
              {quote.pickupDate && (
                <p>
                  <span className="font-medium">Prise en charge:</span>{' '}
                  {format(new Date(quote.pickupDate), 'dd MMMM yyyy', { locale: fr })}
                  {quote.pickupTime && ` à ${quote.pickupTime}`}
                </p>
              )}
              {quote.deliveryDate && (
                <p>
                  <span className="font-medium">Livraison:</span>{' '}
                  {format(new Date(quote.deliveryDate), 'dd MMMM yyyy', { locale: fr })}
                  {quote.deliveryTime && ` à ${quote.deliveryTime}`}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Adresses</h3>
              <p><span className="font-medium">Départ:</span> {quote.pickupAddress}</p>
              <p><span className="font-medium">Livraison:</span> {quote.deliveryAddress}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Véhicules ({quote.vehicles.length})</h3>
              <div className="space-y-2">
                {quote.vehicles.map((vehicle, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p><span className="font-medium">Marque:</span> {vehicle.brand}</p>
                    <p><span className="font-medium">Modèle:</span> {vehicle.model}</p>
                    <p><span className="font-medium">Année:</span> {vehicle.year}</p>
                    <p><span className="font-medium">Carburant:</span> {vehicle.fuel}</p>
                    <p><span className="font-medium">Immatriculation:</span> {vehicle.licensePlate}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Prix</h3>
              <p className="text-xl font-semibold">{quote.totalPriceHT}€ HT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetails;
