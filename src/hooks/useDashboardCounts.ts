
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

      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching quotes:', error);
        return { 
          pendingQuotes: 0,
          ongoingShipments: 0,
          pendingInvoices: 0,
          completedShipments: 0
        };
      }

      return {
        pendingQuotes: quotes?.length || 0,
        ongoingShipments: 0, // To be implemented
        pendingInvoices: 0, // To be implemented
        completedShipments: 0 // To be implemented
      };
    },
    enabled: !!userId
  });
};
