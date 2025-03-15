
import { Card, CardContent } from "@/components/ui/card";
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

const PendingQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

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

  if (quotes.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Devis en attente</h1>
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
      <h1 className="text-3xl font-bold mb-6">Devis en attente</h1>
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
