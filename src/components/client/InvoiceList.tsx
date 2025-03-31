
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { FileText, Download, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceRow } from "@/types/database";

type Invoice = InvoiceRow;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les factures de l'utilisateur
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setInvoices(data as Invoice[] || []);
      } catch (error) {
        console.error('Erreur lors du chargement des factures:', error);
        toast.error("Erreur lors du chargement des factures");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user]);

  const handleDownload = (invoice: Invoice) => {
    // Dans une implémentation réelle, ceci génèrerait un PDF
    toast.info(`Téléchargement de la facture ${invoice.invoice_number}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" /> Mes Factures
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader className="h-6 w-6" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {format(parseISO(invoice.created_at), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <p className="font-semibold">
                    {invoice.price_ttc.toFixed(2)} € TTC
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.price_ht.toFixed(2)} € HT
                  </p>
                </div>
                <div className="flex space-x-2 mt-3 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(invoice)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Télécharger
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={`/invoices/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Voir
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucune facture disponible pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
