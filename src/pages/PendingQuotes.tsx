
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

const PendingQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("status", "pending")
        .order("date_created", { ascending: false });

      if (!error && data) {
        setQuotes(data);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Devis en attente</h1>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Adresse de départ</TableHead>
              <TableHead>Adresse d'arrivée</TableHead>
              <TableHead className="text-right">Prix TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.quote_number}</TableCell>
                <TableCell>
                  {format(new Date(quote.date_created), "Pp", { locale: fr })}
                </TableCell>
                <TableCell>{quote.pickup_address}</TableCell>
                <TableCell>{quote.delivery_address}</TableCell>
                <TableCell className="text-right">{quote.total_price_ttc}€</TableCell>
              </TableRow>
            ))}
            {quotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Aucun devis en attente
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default PendingQuotes;
