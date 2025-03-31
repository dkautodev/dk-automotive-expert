
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { MissionRow } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/lib/utils";

interface OngoingMissionsTableProps {
  refreshTrigger?: number;
}

const OngoingMissionsTable: React.FC<OngoingMissionsTableProps> = ({ 
  refreshTrigger = 0 
}) => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        // Récupérer les missions avec le statut "confirmé", "confirme" ou "prise_en_charge"
        const { data, error } = await supabase
          .from('missions')
          .select(`
            *,
            clientProfile:client_id(
              first_name,
              last_name,
              company_name
            )
          `)
          .in('status', ['confirmé', 'confirme', 'prise_en_charge'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setMissions(data as MissionRow[] || []);
      } catch (err) {
        console.error('Error fetching ongoing missions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Missions en cours</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Missions en cours</CardTitle>
      </CardHeader>
      <CardContent>
        {missions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((mission) => {
                const client = mission.clientProfile as any;
                const vehicleInfo = mission.vehicle_info as any;
                
                return (
                  <TableRow key={mission.id}>
                    <TableCell className="font-medium">{mission.mission_number}</TableCell>
                    <TableCell>
                      {client?.company_name || `${client?.first_name || ''} ${client?.last_name || ''}`}
                    </TableCell>
                    <TableCell>{formatDate(mission.created_at)}</TableCell>
                    <TableCell>
                      {vehicleInfo ? (
                        <span>
                          {vehicleInfo.brand} {vehicleInfo.model}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <MissionStatusBadge status={mission.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">Aucune mission en cours</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingMissionsTable;
