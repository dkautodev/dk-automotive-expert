
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  pendingQuotesCount?: number;
  ongoingMissionsCount?: number;
}

const DashboardCards = ({ pendingQuotesCount = 0, ongoingMissionsCount = 0 }: DashboardCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Devis en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingQuotesCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Missions en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{ongoingMissionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
