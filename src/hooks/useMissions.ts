
import { useState, useEffect, useCallback } from "react";
import { MissionRow, UserProfileRow, MissionStatus } from "@/types/database";
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
  filterStatus
}: UseMissionsProps = {}) {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching missions with refreshTrigger: ${refreshTrigger}, showAllMissions: ${showAllMissions}, filterStatus:`, filterStatus);
      
      // Start building the query to fetch missions
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter only if showAllMissions is false and filterStatus is provided
      if (!showAllMissions && filterStatus) {
        if (Array.isArray(filterStatus)) {
          console.log(`Filtering by multiple statuses: ${filterStatus.join(', ')}`);
          query = query.in('status', filterStatus);
        } else {
          console.log(`Filtering by single status: ${filterStatus}`);
          query = query.eq('status', filterStatus);
        }
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching missions:", error);
        throw error;
      }
      
      console.log(`Missions fetched: ${data?.length || 0}`);
      
      if (!data || data.length === 0) {
        console.log("No missions found in database");
        setMissions([]);
        setLoading(false);
        return;
      }
      
      // Transform missions to include properly typed objects
      const transformedMissions = data.map(mission => {
        const vehicleInfo = mission.vehicle_info as any || {};
        
        // Explicitly cast mission_type to the correct type
        const missionType = mission.mission_type === 'livraison' || mission.mission_type === 'restitution' 
          ? mission.mission_type as "livraison" | "restitution"
          : "livraison"; // Default value if not a valid type
        
        // Validate and cast the status to MissionStatus type
        const validateStatus = (status: string): MissionStatus => {
          const validStatuses: MissionStatus[] = [
            "termine", "prise_en_charge", "en_attente", "confirme", 
            "confirmé", "livre", "incident", "annule", "annulé"
          ];
          
          return validStatuses.includes(status as MissionStatus) 
            ? status as MissionStatus 
            : "en_attente"; // Default to "en_attente" if invalid status
        };
        
        // Create a properly typed mission object (without clientProfile for now)
        const typedMission: MissionRow = {
          ...mission,
          mission_type: missionType,
          status: validateStatus(mission.status),
          pickup_address: vehicleInfo?.pickup_address || 'Non spécifié',
          delivery_address: vehicleInfo?.delivery_address || 'Non spécifié',
          clientProfile: null // Will be populated later
        };
        
        return typedMission;
      });
      
      // Now fetch all client profiles in a single query
      if (transformedMissions.length > 0) {
        // Extract unique client IDs
        const clientIds = [...new Set(transformedMissions.map(m => m.client_id))].filter(Boolean);
        
        if (clientIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', clientIds);
            
          if (profilesError) {
            console.error("Error fetching client profiles:", profilesError);
            // Continue without profiles rather than failing completely
          } else if (profiles) {
            // Attach profiles to respective missions
            const missionsWithProfiles = transformedMissions.map(mission => {
              const clientProfile = profiles.find(
                profile => profile.user_id === mission.client_id
              ) || null;
              
              return {
                ...mission,
                clientProfile
              };
            });
            
            console.log(`Number of missions with profiles: ${missionsWithProfiles.length}`);
            setMissions(missionsWithProfiles);
            setLoading(false);
            return;
          }
        }
      }
      
      console.log(`Number of transformed missions: ${transformedMissions.length}`);
      setMissions(transformedMissions);
    } catch (err) {
      console.error('Error in useMissions hook:', err);
      toast.error("Erreur lors de la récupération des missions");
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger, showAllMissions, filterStatus]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return { missions, loading, refetch: fetchMissions };
}
