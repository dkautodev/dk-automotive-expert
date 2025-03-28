
import { MissionRow } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CompletedMissionsTableProps {
  missions: MissionRow[];
}

const CompletedMissionsTable = ({ missions }: CompletedMissionsTableProps) => {
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
        <CardTitle>Missions terminées récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Mission</TableHead>
              <TableHead>Adresse départ</TableHead>
              <TableHead>Adresse livraison</TableHead>
              <TableHead>Date de fin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length > 0 ? (
              missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium">{mission.id.substring(0, 8)}</TableCell>
                  <TableCell>{mission.pickup_address || "N/A"}</TableCell>
                  <TableCell>{mission.delivery_address || "N/A"}</TableCell>
                  <TableCell>{mission.updated_at ? formatDate(mission.updated_at) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">Aucune mission terminée</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompletedMissionsTable;
