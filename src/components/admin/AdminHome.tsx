
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminHome = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">En maintenance</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Le tableau de bord administrateur est actuellement en cours de maintenance.
            Il sera de nouveau disponible prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
