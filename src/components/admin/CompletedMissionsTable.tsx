
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface CompletedMissionsTableProps {
  missions: any[];
}

const CompletedMissionsTable = ({ missions = [] }: CompletedMissionsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missions livrées récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mission</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell>{mission.mission_number}</TableCell>
                  <TableCell>{mission.client_name}</TableCell>
                  <TableCell>{new Date(mission.delivery_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">{mission.price}€</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Aucune mission livrée récemment
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompletedMissionsTable;
