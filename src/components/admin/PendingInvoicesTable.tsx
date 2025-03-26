
import { QuoteRow } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PendingInvoicesTableProps {
  invoices: QuoteRow[];
}

const PendingInvoicesTable = ({ invoices }: PendingInvoicesTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures en attente de paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Devis</TableHead>
              <TableHead>Départ</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.quote_number}</TableCell>
                  <TableCell>{invoice.pickup_address.split(',')[0]}</TableCell>
                  <TableCell>{invoice.delivery_address.split(',')[0]}</TableCell>
                  <TableCell>{invoice.total_price_ttc} €</TableCell>
                  <TableCell>{formatDate(invoice.date_created || "")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Aucune facture en attente</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingInvoicesTable;
