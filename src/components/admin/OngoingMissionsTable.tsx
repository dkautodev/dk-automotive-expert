
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
        // Fetch mission data first
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .in('status', ['confirmé', 'confirme', 'prise_en_charge'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (missionsError) throw missionsError;
        
        if (missionsData && missionsData.length > 0) {
          // Get the client profiles for these missions as a separate query
          const clientIds = missionsData.map(mission => mission.client_id);
          const { data: clientProfiles, error: clientsError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', clientIds);
          
          if (clientsError) throw clientsError;

          // Map profiles to missions
          const formattedMissions = missionsData.map(mission => {
            const vehicleInfo = mission.vehicle_info as any || {};
            const clientProfile = clientProfiles?.find(profile => profile.user_id === mission.client_id) || null;
            
            return {
              ...mission,
              pickup_address: vehicleInfo.pickup_address || 'N/A',
              delivery_address: vehicleInfo.delivery_address || 'N/A',
              clientProfile
            } as MissionRow;
          });

          setMissions(formattedMissions);
        } else {
          setMissions([]);
        }
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
