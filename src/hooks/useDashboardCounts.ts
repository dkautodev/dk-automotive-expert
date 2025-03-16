
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardCounts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['dashboard-counts', userId],
    queryFn: async () => {
      if (!userId) return { pendingQuotes: 0 };

      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching quotes:', error);
        return { pendingQuotes: 0 };
      }

      return {
        pendingQuotes: quotes?.length || 0
      };
    },
    enabled: !!userId
  });
};
