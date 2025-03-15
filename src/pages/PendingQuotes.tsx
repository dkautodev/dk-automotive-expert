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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";
import { useQuery } from "@tanstack/react-query";

const PendingQuotes = () => {
  const { fetchQuotes } = useQuoteManagement();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const navigate = useNavigate();

  const { data: quotes = [], isLoading, error } = useQuery({
    queryKey: ['pendingQuotes'],
    queryFn: fetchQuotes
  });

  const handleViewQuoteDetails = (quote: Quote) => {
    navigate("/dashboard/client/quote-total", { 
      state: {
        pickupAddress: quote.pickupAddress,
        deliveryAddress: quote.deliveryAddress,
        vehicles: quote.vehicles,
        priceHT: (quote.totalPriceHT / quote.vehicles.length).toString(),
      }
    });
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
                <TableHead>Date</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Véhicules</TableHead>
                <TableHead className="text-right">Prix HT</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">DEV-{quote.id}</TableCell>
                  <TableCell>
                    {format(quote.dateCreated, 'dd MMMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>{quote.pickupAddress}</TableCell>
                  <TableCell>{quote.deliveryAddress}</TableCell>
                  <TableCell>{quote.vehicles.length}</TableCell>
                  <TableCell className="text-right">{quote.totalPriceHT}€</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline"
                      onClick={() => handleViewQuoteDetails(quote)}
                    >
                      Voir le détail
                    </Button>
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
