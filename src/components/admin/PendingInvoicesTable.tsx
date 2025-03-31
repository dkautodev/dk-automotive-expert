
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PendingInvoicesTableProps {
  missions: any[];
}

const PendingInvoicesTable = ({ missions = [] }: PendingInvoicesTableProps) => {
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
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell>{mission.invoice_number || `FACTURE-${mission.mission_number}`}</TableCell>
                  <TableCell>{mission.client_name}</TableCell>
                  <TableCell>{new Date(mission.delivery_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{mission.price}€</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                      En attente
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Marquer comme payée
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
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
