
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardCounts {
  pendingQuotes: number;
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
}

export const useDashboardCounts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['dashboard-counts', userId],
    queryFn: async () => {
      if (!userId) return { 
        pendingQuotes: 0,
        ongoingShipments: 0,
        pendingInvoices: 0,
        completedShipments: 0
      };

      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending');

      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', userId);

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
      }

      if (missionsError) {
        console.error('Error fetching missions:', missionsError);
      }

      const ongoingShipments = missions?.filter(m => m.status === 'in_progress').length || 0;
      const completedShipments = missions?.filter(m => m.status === 'completed').length || 0;

      return {
        pendingQuotes: quotes?.length || 0,
        ongoingShipments,
        pendingInvoices: 0, // To be implemented
        completedShipments
      };
    },
    enabled: !!userId
  });
};
