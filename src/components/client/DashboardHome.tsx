import { Button } from "@/components/ui/button";
import { LogOut, Receipt, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useDashboardCounts } from "@/hooks/useDashboardCounts";
import { toast } from "@/components/ui/use-toast";
import TodayMissions from "./TodayMissions";
const DashboardHome = () => {
  const {
    signOut,
    user
  } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: counts = {
      ongoingShipments: 0,
      pendingInvoices: 0,
      completedShipments: 0,
      pendingQuotes: 0
    }
  } = useDashboardCounts(user?.id);
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };
  return <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord Client</h1>
        <div className="flex gap-3">
          
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link to="ongoing-shipments" className="block h-full">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-lg">Convoyages en cours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{counts.ongoingShipments}</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="pending-quotes" className="block h-full">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Devis en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{counts.pendingQuotes}</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="pending-invoices" className="block h-full">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5" />
                  Factures en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{counts.pendingInvoices}</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Convoyages terminés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{counts.completedShipments}</p>
            </CardContent>
          </Card>
        </div>
        
        <TodayMissions />
      </div>
    </div>;
};
export default DashboardHome;