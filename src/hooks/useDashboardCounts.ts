
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardCounts {
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
  pendingQuotes: number;
}

export const useDashboardCounts = () => {
  const fetchCounts = async (): Promise<DashboardCounts> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return {
          ongoingShipments: 0,
          pendingInvoices: 0,
          completedShipments: 0,
          pendingQuotes: 0
        };
      }

      const { count: pendingQuotesCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('user_id', user.id);

      return {
        ongoingShipments: 0,
        pendingInvoices: 0,
        completedShipments: 0,
        pendingQuotes: pendingQuotesCount || 0
      };
    } catch (error) {
      console.error("Error in fetchCounts:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['dashboardCounts'],
    queryFn: fetchCounts
  });
};
