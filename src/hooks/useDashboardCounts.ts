
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardCounts {
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
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
        };
      }

      console.log("Fetching counts for user:", user.id);

      const { count: pendingQuotesCount, error } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching counts:", error);
        throw error;
      }

      console.log("Fetched pending quotes count:", pendingQuotesCount);

      return {
        ongoingShipments: 0,
        pendingInvoices: 0,
        completedShipments: pendingQuotesCount || 0,
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
