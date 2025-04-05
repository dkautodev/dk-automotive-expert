
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { toast } from "sonner";
import { Circle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardCardsProps {
  refreshTrigger?: number;
}

// Define a proper interface for the dashboard counts
interface DashboardCounts {
  totalMissionsCount: number;
  pendingQuotesCount: number;
  ongoingMissionsCount: number;
  completedMissionsCount: number;
}

const DashboardCards = ({ refreshTrigger = 0 }: DashboardCardsProps) => {
  // Use react-query for better caching and state management
  const { data: counts, isLoading } = useQuery({
    queryKey: ['dashboard-counts', refreshTrigger],
    queryFn: async (): Promise<DashboardCounts> => {
      try {
        console.log("DashboardCards: Fetching counts with refreshTrigger:", refreshTrigger);
        
        // Fetch total missions count (no filtering for admin dashboard)
        const { count: totalCount, error: totalError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) {
          console.error("Error fetching total missions:", totalError);
          throw totalError;
        }
        
        // Fetch pending quotes count - status 'en_attente'
        const { count: pendingCount, error: pendingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'en_attente');
        
        if (pendingError) {
          console.error("Error fetching pending quotes:", pendingError);
          throw pendingError;
        }
        
        // Fetch ongoing missions count - statuses 'confirmé', 'confirme' or 'prise_en_charge'
        const { count: ongoingCount, error: ongoingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['confirmé', 'confirme', 'prise_en_charge']);
        
        if (ongoingError) {
          console.error("Error fetching ongoing missions:", ongoingError);
          throw ongoingError;
        }
        
        // Fetch completed missions count - statuses 'termine' or 'livre'
        const { count: completedCount, error: completedError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['termine', 'livre']);
        
        if (completedError) {
          console.error("Error fetching completed missions:", completedError);
          throw completedError;
        }
        
        console.log("Mission counts:", {
          total: totalCount,
          pending: pendingCount,
          ongoing: ongoingCount,
          completed: completedCount
        });
        
        return {
          totalMissionsCount: totalCount || 0,
          pendingQuotesCount: pendingCount || 0,
          ongoingMissionsCount: ongoingCount || 0,
          completedMissionsCount: completedCount || 0
        };
      } catch (error: any) {
        console.error('Error fetching dashboard counts:', error);
        toast.error(`Erreur: ${error.message}`);
        return {
          totalMissionsCount: 0,
          pendingQuotesCount: 0,
          ongoingMissionsCount: 0,
          completedMissionsCount: 0
        };
      }
    },
    staleTime: 60 * 1000, // 1 minute - réduit pour plus de réactivité
    retry: 2
  });

  // Default counts object with zeroes to handle undefined
  const defaultCounts: DashboardCounts = {
    totalMissionsCount: 0,
    pendingQuotesCount: 0,
    ongoingMissionsCount: 0,
    completedMissionsCount: 0
  };

  // Use counts or defaultCounts if counts is undefined
  const displayCounts = counts || defaultCounts;

  return (
    <div className="grid gap-6 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total des missions</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{isLoading ? '...' : displayCounts.totalMissionsCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Devis en attente</CardTitle>
          <Circle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{isLoading ? '...' : displayCounts.pendingQuotesCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Missions en cours</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{isLoading ? '...' : displayCounts.ongoingMissionsCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{isLoading ? '...' : displayCounts.completedMissionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
