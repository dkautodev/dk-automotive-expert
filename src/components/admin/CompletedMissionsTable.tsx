
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        // Use the safeTable helper for the unified_missions table
        const missionResult = await safeTable('unified_missions')
          .select('*')
          .eq('status', 'livre')
          .order('delivery_date', { ascending: false })
          .limit(5);
        
        if (missionResult.error) throw missionResult.error;
        
        if (!missionResult.data || missionResult.data.length === 0) {
          setMissions([]);
          setLoading(false);
          return;
        }

        // Explicit casting to MissionRow[]
        const missionData = missionResult.data as any[] as MissionRow[];
        
        const clientIds = missionData.map(mission => mission.client_id);
        
        // Use safeTable helper for unified_users
        const clientResult = await safeTable('unified_users')
          .select('*')
          .in('id', clientIds);
          
        if (clientResult.error) throw clientResult.error;
        
        const clientProfiles = clientResult.data;
        
        const missionsWithClientInfo = missionData.map(mission => {
          // Find the corresponding client profile
          const clientProfile = clientProfiles?.find((profile: any) => 
            profile.id === mission.client_id
          );
          
          if (clientProfile) {
            // Create an object that conforms to UserProfileRow interface
            mission.clientProfile = {
              id: clientProfile.id,
              user_id: clientProfile.id, // Use id as user_id for compatibility
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
