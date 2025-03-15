
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

const PendingQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les devis depuis le localStorage
    const savedQuotes = localStorage.getItem('pendingQuotes');
    if (savedQuotes) {
      const parsedQuotes = JSON.parse(savedQuotes).map((quote: Quote) => ({
        ...quote,
        dateCreated: new Date(quote.dateCreated)
      }));
      setQuotes(parsedQuotes);
    }
  }, []);

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

  if (quotes.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/client")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Devis en attente</h1>
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
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/client")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-3xl font-bold">Devis en attente</h1>
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
