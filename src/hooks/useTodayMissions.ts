
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';
import { MissionRow } from '@/types/database';

export type MissionStatus = 'en_attente' | 'confirme' | 'confirmé' | 'prise_en_charge' | 'livre' | 'incident' | 'annule' | 'termine';

// We'll extend the MissionRow type to ensure we have all required fields
export interface Mission extends MissionRow {
  status: MissionStatus;
  pickup_address: string;
  delivery_address: string;
  vehicles: any | null;
}

export const useTodayMissions = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['today-missions', userId],
    queryFn: async () => {
      if (!userId) return [];

      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      const endOfToday = endOfDay(today).toISOString();

      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', userId)
        .gte('created_at', startOfToday)
        .lte('created_at', endOfToday);

      if (error) {
        console.error('Error fetching today missions:', error);
        throw error;
      }

      // Cast the response data to our Mission type, ensuring pickup_address and delivery_address are present
      return (data || []).map(mission => ({
        ...mission,
        pickup_address: mission.pickup_address || '',
        delivery_address: mission.delivery_address || ''
      })) as Mission[];
    },
    enabled: !!userId
  });
};
