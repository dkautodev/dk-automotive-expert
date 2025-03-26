import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const AdminHome = () => {
  return <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Administrateur</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Devis en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missions en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      
    </div>;
};
export default AdminHome;