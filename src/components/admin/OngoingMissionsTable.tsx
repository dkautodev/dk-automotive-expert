
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
  showAllMissions?: boolean;
}

const OngoingMissionsTable: React.FC<OngoingMissionsTableProps> = ({ 
  refreshTrigger = 0,
  showAllMissions = false
}) => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMissions, setAllMissions] = useState<MissionRow[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        console.log("Fetching missions...");
        
        // Fetch all mission data for debugging
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (missionsError) {
          console.error("Error fetching missions:", missionsError);
          throw missionsError;
        }
        
        console.log("All missions fetched:", missionsData);
        
        if (!missionsData || missionsData.length === 0) {
          console.log("No missions found");
          setAllMissions([]);
          setMissions([]);
          setLoading(false);
          return;
        }
        
        // Transform missions to include pickup_address and delivery_address as direct properties
        const transformedMissions = missionsData.map(mission => {
          const vehicleInfo = mission.vehicle_info as any || {};
          
          return {
            ...mission,
            pickup_address: vehicleInfo.pickup_address || 'N/A',
            delivery_address: vehicleInfo.delivery_address || 'N/A',
          } as MissionRow;
        });
        
        setAllMissions(transformedMissions);
        
        // Filter missions based on status if not showing all
        const filteredMissions = showAllMissions ? 
          transformedMissions : 
          transformedMissions.filter(mission => 
            mission.status === 'confirmé' || 
            mission.status === 'confirme' || 
            mission.status === 'prise_en_charge'
          );
        
        console.log("Filtered missions:", filteredMissions);
        console.log("Mission statuses:", filteredMissions.map(m => m.status));
        
        if (filteredMissions.length > 0) {
          // Get the client profiles for these missions as a separate query
          const clientIds = filteredMissions.map(mission => mission.client_id);
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
          const formattedMissions = filteredMissions.map(mission => {
            const clientProfile = clientProfiles?.find(profile => profile.user_id === mission.client_id) || null;
            
            return {
              ...mission,
              clientProfile
            } as unknown as MissionRow;
          });

          setMissions(formattedMissions);
        } else {
          setMissions([]);
        }
      } catch (err) {
        console.error('Error fetching missions:', err);
        toast.error("Erreur lors de la récupération des missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [refreshTrigger, showAllMissions]);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>{showAllMissions ? "Toutes les missions" : "Missions en cours"}</CardTitle>
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
        <CardTitle>{showAllMissions ? "Toutes les missions" : "Missions en cours"}</CardTitle>
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
                    <TableCell className="font-medium">{mission.mission_number || "N/A"}</TableCell>
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
          <div>
            <p className="text-center text-muted-foreground py-4">
              {showAllMissions ? "Aucune mission trouvée" : "Aucune mission en cours"}
            </p>
            {allMissions.length > 0 && !showAllMissions && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Statistiques des missions (déboguer):</h3>
                <ul className="text-sm">
                  <li>Total des missions: {allMissions.length}</li>
                  <li>Statuts trouvés: {Array.from(new Set(allMissions.map(m => m.status))).join(', ')}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingMissionsTable;
