
import { MissionRow } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PendingInvoicesTableProps {
  missions: MissionRow[];
}

const PendingInvoicesTable = ({ missions }: PendingInvoicesTableProps) => {
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
              <TableHead>N° Mission</TableHead>
              <TableHead>Départ</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium">{mission.mission_number}</TableCell>
                  <TableCell>{mission.pickup_address?.split(',')[0] || 'N/A'}</TableCell>
                  <TableCell>{mission.delivery_address?.split(',')[0] || 'N/A'}</TableCell>
                  <TableCell>{mission.price_ttc} €</TableCell>
                  <TableCell>{formatDate(mission.created_at || "")}</TableCell>
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
