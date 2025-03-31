
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
import { toast } from "sonner";

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
        console.log("Fetching ongoing missions...");
        
        // Fetch mission data with all statuses to debug
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (missionsError) {
          console.error("Error fetching missions:", missionsError);
          throw missionsError;
        }
        
        console.log("All missions fetched:", missionsData);
        
        // Filter missions for "confirmé", "confirme" or "prise_en_charge" status
        const ongoingMissions = missionsData?.filter(mission => 
          mission.status === 'confirmé' || 
          mission.status === 'confirme' || 
          mission.status === 'prise_en_charge'
        ) || [];
        
        console.log("Filtered ongoing missions:", ongoingMissions);
        
        if (ongoingMissions.length > 0) {
          // Get the client profiles for these missions as a separate query
          const clientIds = ongoingMissions.map(mission => mission.client_id);
          const { data: clientProfiles, error: clientsError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', clientIds);
          
          if (clientsError) {
            console.error("Error fetching client profiles:", clientsError);
            throw clientsError;
          }

          console.log("Client profiles fetched:", clientProfiles);
          
          // Map profiles to missions
          const formattedMissions = ongoingMissions.map(mission => {
            const vehicleInfo = mission.vehicle_info as any || {};
            const clientProfile = clientProfiles?.find(profile => profile.user_id === mission.client_id) || null;
            
            return {
              ...mission,
              pickup_address: vehicleInfo.pickup_address || 'N/A',
              delivery_address: vehicleInfo.delivery_address || 'N/A',
              clientProfile
            } as unknown as MissionRow;
          });

          setMissions(formattedMissions);
        } else {
          setMissions([]);
        }
      } catch (err) {
        console.error('Error fetching ongoing missions:', err);
        toast.error("Erreur lors de la récupération des missions en cours");
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
