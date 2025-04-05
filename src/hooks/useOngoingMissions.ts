
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow, UserProfileRow } from "@/types/database";

export function useOngoingMissions(userId?: string) {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchOngoingMissions(userId);
    }
  }, [userId]);

  async function fetchOngoingMissions(userId: string) {
    setLoading(true);
    
    try {
      // Fetch missions
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', userId)
        .in('status', ['confirmé', 'confirme', 'prise_en_charge'])
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching ongoing missions:", error);
        setMissions([]);
        setLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        setMissions([]);
        setLoading(false);
        return;
      }
      
      // Fetch client profiles separately to avoid relation errors
      const missionsData = data;
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', missionsData.map(m => m.client_id));
        
      if (profileError) {
        console.error("Error fetching client profiles:", profileError);
      }
      
      // Transform the data to ensure it matches the MissionRow type
      const transformedMissions: MissionRow[] = missionsData.map(mission => {
        const vehicleInfo = mission.vehicle_info as any;
        
        // Find corresponding profile
        const profile = profiles ? profiles.find(p => p.user_id === mission.client_id) : null;
        
        return {
          ...mission,
          // Get pickup_address and delivery_address from vehicle_info if they don't exist
          pickup_address: vehicleInfo?.pickup_address || 'Non spécifié',
          delivery_address: vehicleInfo?.delivery_address || 'Non spécifié',
          // Attach the client profile or set to null if not found
          clientProfile: profile || null
        } as MissionRow;
      });
      
      setMissions(transformedMissions);
    } catch (error) {
      console.error("Error in useOngoingMissions:", error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    missions,
    loading,
    refreshMissions: () => userId && fetchOngoingMissions(userId)
  };
}
