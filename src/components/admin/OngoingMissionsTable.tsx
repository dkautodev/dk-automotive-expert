
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

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        console.log(`Fetching missions with refreshTrigger: ${refreshTrigger}, showAllMissions: ${showAllMissions}`);
        
        // Query without any filters initially
        let query = supabase
          .from('missions')
          .select('*')
          .order('created_at', { ascending: false });
        
        // We don't apply any filters if showAllMissions is true
        // This ensures we get ALL missions regardless of status
        
        const { data: missionsData, error: missionsError } = await query;

        if (missionsError) {
          console.error("Erreur lors de la récupération des missions:", missionsError);
          throw missionsError;
        }
        
        console.log("Missions récupérées:", missionsData);
        
        if (!missionsData || missionsData.length === 0) {
          console.log("Aucune mission trouvée dans la base de données");
          setMissions([]);
          setLoading(false);
          return;
        }
        
        // Transform missions to include addresses as direct properties
        const transformedMissions = missionsData.map(mission => {
          const vehicleInfo = mission.vehicle_info as any || {};
          
          const missionWithAddresses = {
            ...mission,
            pickup_address: vehicleInfo?.pickup_address || 'Non spécifié',
            delivery_address: vehicleInfo?.delivery_address || 'Non spécifié',
          } as MissionRow;
          
          return missionWithAddresses;
        });
        
        console.log(`Nombre de missions transformées: ${transformedMissions.length}`);
        
        // Filter missions by status only if showAllMissions is false
        const filteredMissions = showAllMissions 
          ? transformedMissions 
          : transformedMissions.filter(mission => 
              mission.status === 'confirmé' || 
              mission.status === 'confirme' || 
              mission.status === 'prise_en_charge'
            );
        
        console.log(`Missions filtrées (${filteredMissions.length}):`, filteredMissions);
        console.log("Statuts des missions:", filteredMissions.map(m => m.status).join(', '));
        
        // Get client profiles for all missions
        try {
          const clientIds = filteredMissions
            .map(mission => mission.client_id)
            .filter(Boolean);
          
          if (clientIds.length > 0) {
            const { data: clientProfiles, error: clientsError } = await supabase
              .from('user_profiles')
              .select('*')
              .in('user_id', clientIds);
            
            if (clientsError) {
              console.error("Erreur lors de la récupération des profils clients:", clientsError);
              throw clientsError;
            }

            console.log("Profils clients récupérés:", clientProfiles);
            
            // Associate profiles with missions
            const formattedMissions = filteredMissions.map(mission => {
              const clientProfile = clientProfiles?.find(profile => profile.user_id === mission.client_id) || null;
              
              return {
                ...mission,
                clientProfile
              } as MissionRow;
            });

            console.log("Missions avec profils clients:", formattedMissions);
            setMissions(formattedMissions);
          } else {
            console.log("Aucun ID client trouvé pour les missions");
            setMissions(filteredMissions as MissionRow[]);
          }
        } catch (profileError) {
          console.error("Erreur lors de la récupération des profils:", profileError);
          // Continue with missions even without client profiles
          setMissions(filteredMissions as MissionRow[]);
        }
      } catch (err) {
        console.error('Erreur globale lors de la récupération des missions:', err);
        toast.error("Erreur lors de la récupération des missions");
        setMissions([]);
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
                <TableHead>Adresse départ</TableHead>
                <TableHead>Adresse livraison</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((mission) => {
                const client = mission.clientProfile as any;
                const vehicleInfo = mission.vehicle_info as any || {};
                
                return (
                  <TableRow key={mission.id}>
                    <TableCell className="font-medium">
                      {mission.mission_number || "Non attribué"}
                    </TableCell>
                    <TableCell>
                      {client?.company_name || `${client?.first_name || ''} ${client?.last_name || ''}` || "Non spécifié"}
                    </TableCell>
                    <TableCell>{formatDate(mission.created_at)}</TableCell>
                    <TableCell>
                      {vehicleInfo ? (
                        <span>
                          {vehicleInfo.brand || ''} {vehicleInfo.model || ''}
                        </span>
                      ) : (
                        "Non spécifié"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={mission.pickup_address}>
                      {mission.pickup_address}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={mission.delivery_address}>
                      {mission.delivery_address}
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {showAllMissions ? "Aucune mission trouvée dans la base de données" : "Aucune mission en cours"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {showAllMissions ? "Créez votre première mission en utilisant le bouton en haut de la page" : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingMissionsTable;
