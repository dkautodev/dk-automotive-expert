import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Quote } from "@/types/order";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Download, X } from "lucide-react";
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
import { generateQuotePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

const PendingQuotes = () => {
  const { fetchQuotes, deleteQuote } = useQuoteManagement();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading, error } = useQuery({
    queryKey: ['pendingQuotes'],
    queryFn: fetchQuotes
  });

  const handleViewQuoteDetails = (quote: Quote) => {
    navigate(`/dashboard/client/quotes/${quote.id}`);
  };

  const handleGeneratePDF = (quote: Quote) => {
    generateQuotePDF(quote);
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await deleteQuote(id);
      await queryClient.invalidateQueries({ queryKey: ['pendingQuotes'] });
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du devis.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Chargement des devis...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Une erreur est survenue lors du chargement des devis.</div>;
  }

  if (quotes.length === 0) {
    return (
      <div className="p-6">
        <div className="relative mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/client")}
            className="absolute left-0 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold text-center">Devis en attente</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Aucun devis en attente pour le moment.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/client")}
          className="absolute left-0 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-3xl font-bold text-center">Devis en attente</h1>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Prix HT</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.quote_number}</TableCell>
                  <TableCell>
                    {format(new Date(quote.dateCreated), 'dd MMMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>{quote.pickupAddress}</TableCell>
                  <TableCell>{quote.deliveryAddress}</TableCell>
                  <TableCell>{quote.totalPriceHT.toFixed(2)}€</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewQuoteDetails(quote)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleGeneratePDF(quote)}
                        title="Télécharger le PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            title="Supprimer"
                          >
                            <X className="h-4 w-4" />
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
                            <AlertDialogAction onClick={() => handleDeleteQuote(quote.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingQuotes;
