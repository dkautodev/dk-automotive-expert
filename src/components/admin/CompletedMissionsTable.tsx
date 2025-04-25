
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { MissionRow } from "@/types/database";

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
        // First, fetch the basic mission data
        const { data, error } = await extendedSupabase
          .from('missions')
          .select('*')
          .eq('status', 'livre')
          .order('delivery_date', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // Check if we have data
        if (!data || data.length === 0) {
          setMissions([]);
          setLoading(false);
          return;
        }

        // Now fetch client profiles separately to avoid type mismatch
        const missionData = data as unknown as MissionRow[];
        
        // Fetch client profiles for display
        const clientIds = missionData.map(mission => mission.client_id);
        const { data: clientProfiles, error: clientError } = await extendedSupabase
          .from('user_profiles')
          .select('*')
          .in('user_id', clientIds);
        
        if (clientError) throw clientError;
        
        // Map client names to missions
        const missionsWithClientInfo = missionData.map(mission => {
          mission.clientProfile = clientProfiles?.find(profile => 
            profile.user_id === mission.client_id
          ) || null;
          
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

  const getClientName = (mission: MissionRow) => {
    const profile = mission.clientProfile;
    if (!profile) return 'Client inconnu';
    
    // Priorité au code client s'il existe
    if (profile.client_code && profile.client_code.trim() !== "") {
      return profile.client_code;
    }
    
    // Ensuite, priorité au nom de la société
    if (profile.company_name && profile.company_name.trim() !== "") {
      return profile.company_name;
    }
    
    // En dernier recours, utiliser le nom et prénom
    if (profile.first_name || profile.last_name) 
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    
    return 'Client inconnu';
  };

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
                    <TableCell>{getClientName(mission)}</TableCell>
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
