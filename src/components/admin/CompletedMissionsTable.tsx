
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { MissionRow } from "@/types/database";
import { formatMissionClientName } from "@/utils/clientFormatter";
import { safeTable } from "@/utils/supabase-helper";

export interface CompletedMissionsTableProps {
  missions?: MissionRow[];
  refreshTrigger?: number;
}

const CompletedMissionsTable = ({ missions: initialMissions = [], refreshTrigger = 0 }: CompletedMissionsTableProps) => {
  const [missions, setMissions] = useState<MissionRow[]>(initialMissions);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedMissions = async () => {
      setLoading(true);
      try {
        // Utilisez la nouvelle table unified_missions
        const { data, error } = await safeTable('unified_missions')
          .select('*')
          .eq('status', 'livre')
          .order('delivery_date', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setMissions([]);
          setLoading(false);
          return;
        }

        // Conversion sécurisée des données
        const missionData = data as unknown as MissionRow[];
        
        const clientIds = missionData.map(mission => mission.client_id);
        // Utilisez la nouvelle table unified_users
        const { data: clientProfiles, error: clientError } = await safeTable('unified_users')
          .select('*')
          .in('id', clientIds);
        
        if (clientError) throw clientError;
        
        const missionsWithClientInfo = missionData.map(mission => {
          // Adapter le profil client pour le rendre compatible avec UserProfileRow
          const clientProfile = clientProfiles?.find(profile => 
            profile.id === mission.client_id
          );
          
          if (clientProfile) {
            // Créer un objet qui respecte l'interface UserProfileRow
            mission.clientProfile = {
              id: clientProfile.id,
              user_id: clientProfile.id, // Utiliser l'id comme user_id pour compatibilité
              first_name: clientProfile.first_name || '',
              last_name: clientProfile.last_name || '',
              company_name: clientProfile.company_name || '',
              phone: clientProfile.phone || '',
              profile_picture: clientProfile.profile_picture || '',
              client_code: clientProfile.client_code || '',
              siret_number: clientProfile.siret_number || '',
              vat_number: clientProfile.vat_number || '',
              billing_address: clientProfile.billing_address || ''
            };
          }
          
          return mission;
        });
        
        setMissions(missionsWithClientInfo);
      } catch (error: any) {
        console.error('Error fetching completed missions:', error);
        toast.error(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedMissions();
  }, [refreshTrigger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missions livrées récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader className="h-6 w-6" />
          </div>
        ) : (
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
                    <TableCell>{formatMissionClientName(mission)}</TableCell>
                    <TableCell>{mission.delivery_date ? 
                      format(new Date(mission.delivery_date), "dd/MM/yyyy", { locale: fr }) : 
                      'N/A'}
                    </TableCell>
                    <TableCell className="text-right">{mission.price_ttc?.toFixed(2)}€</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedMissionsTable;
