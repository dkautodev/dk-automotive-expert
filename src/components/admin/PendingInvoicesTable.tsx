
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { InvoiceRow } from '@/types/database';

export interface PendingInvoicesTableProps {
  missions: InvoiceRow[];
}

const PendingInvoicesTable = ({ missions = [] }: PendingInvoicesTableProps) => {
  const markAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await extendedSupabase
        .from('invoices')
        .update({ paid: true })
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      toast.success("Facture marquée comme payée");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut de la facture:", err);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures en attente</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro de facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length > 0 ? (
              missions.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                  <TableCell>{invoice.price_ttc}€</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                      En attente
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsPaid(invoice.id)}
                    >
                      Marquer comme payée
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Aucune facture en attente
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingInvoicesTable;
