
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PendingInvoices = () => {
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
      <h1 className="text-3xl font-bold mb-6">Devis en attente</h1>
      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{quote.quote_number}</p>
                <p className="text-sm text-gray-600">
                  Créé le {format(new Date(quote.date_created), "Pp", { locale: fr })}
                </p>
                <p className="mt-2">
                  De: {quote.pickup_address}
                  <br />
                  À: {quote.delivery_address}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{quote.total_price_ttc}€ TTC</p>
                <p className="text-sm text-gray-600">{quote.total_price_ht}€ HT</p>
              </div>
            </div>
          </Card>
        ))}
        {quotes.length === 0 && (
          <p className="text-center text-gray-500">Aucun devis en attente</p>
        )}
      </div>
    </div>
  );
};

export default PendingInvoices;
