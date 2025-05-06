
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuthContext } from "@/context/AuthContext";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

// Define a local interface instead of importing from database.ts
interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  price_ttc: number;
  price_ht: number;
  status: string;
}

export const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Mock data instead of actual database fetch
        setTimeout(() => {
          const mockInvoices: Invoice[] = [
            {
              id: '1',
              invoice_number: 'INV-2023-001',
              created_at: '2023-05-15T10:30:00Z',
              price_ttc: 1200,
              price_ht: 1000,
              status: 'paid'
            },
            {
              id: '2',
              invoice_number: 'INV-2023-002',
              created_at: '2023-06-20T14:45:00Z',
              price_ttc: 840,
              price_ht: 700,
              status: 'pending'
            }
          ];
          
          setInvoices(mockInvoices);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error in fetchInvoices:', err);
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
