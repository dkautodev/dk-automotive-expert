
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

const PendingQuotes = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'en_attente')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMissions(data as MissionRow[]);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Missions en attente</h1>
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
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.mission_number}</TableCell>
                <TableCell>
                  {format(new Date(mission.created_at || ''), "Pp", { locale: fr })}
                </TableCell>
                <TableCell>{mission.pickup_address}</TableCell>
                <TableCell>{mission.delivery_address}</TableCell>
                <TableCell className="text-right">{mission.price_ttc}€</TableCell>
              </TableRow>
            ))}
            {missions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Aucune mission en attente
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
