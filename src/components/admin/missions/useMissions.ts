
import { useState, useEffect } from "react";
import { MissionRow } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseMissionsProps {
  refreshTrigger?: number;
  showAllMissions?: boolean;
  filterStatus?: string | string[];
}

export function useMissions({ 
  refreshTrigger = 0, 
  showAllMissions = false,
  filterStatus = ['confirmé', 'confirme', 'prise_en_charge']
}: UseMissionsProps) {
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
        
        // Apply status filter only if showAllMissions is false
        if (!showAllMissions && filterStatus) {
          if (Array.isArray(filterStatus)) {
            query = query.in('status', filterStatus);
          } else {
            query = query.eq('status', filterStatus);
          }
        }
        
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
        
        // Get client profiles for all missions
        await enrichWithClientProfiles(transformedMissions, setMissions);
        
      } catch (err) {
        console.error('Erreur globale lors de la récupération des missions:', err);
        toast.error("Erreur lors de la récupération des missions");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [refreshTrigger, showAllMissions, filterStatus]);

  return { missions, loading };
}

async function enrichWithClientProfiles(
  missions: MissionRow[], 
  setMissions: React.Dispatch<React.SetStateAction<MissionRow[]>>
) {
  try {
    const clientIds = missions
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
      const formattedMissions = missions.map(mission => {
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
      setMissions(missions as MissionRow[]);
    }
  } catch (profileError) {
    console.error("Erreur lors de la récupération des profils:", profileError);
    // Continue with missions even without client profiles
    setMissions(missions as MissionRow[]);
  }
}
