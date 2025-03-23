
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

export type MissionStatus = 'pending' | 'in_progress' | 'pickup_completed' | 'incident' | 'completed';

export interface Mission {
  id: string;
  status: MissionStatus;
  created_at: string;
  updated_at: string | null;
  client_id: string;
  driver_id: string | null;
  quote_id: string | null;
  quote?: {
    pickup_address: string;
    delivery_address: string;
    vehicles: any;
  };
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
        .select(`
          *,
          quote:quotes(pickup_address, delivery_address, vehicles)
        `)
        .eq('client_id', userId)
        .gte('created_at', startOfToday)
        .lte('created_at', endOfToday);

      if (error) {
        console.error('Error fetching today missions:', error);
        throw error;
      }

      return data as Mission[];
    },
    enabled: !!userId
  });
};
