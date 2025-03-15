
import { Button } from "@/components/ui/button";
import { LogOut, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import OrderForm from "./OrderForm";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";
import { useDashboardCounts } from "@/hooks/useDashboardCounts";

const DashboardHome = () => {
  const { fetchQuotes } = useQuoteManagement();
  const { data: counts = { ongoingShipments: 0, pendingInvoices: 0, completedShipments: 0 } } = useDashboardCounts();
  
  const { data: quotes = [] } = useQuery({
    queryKey: ['pendingQuotes'],
    queryFn: fetchQuotes
  });

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord Client</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2" />
          Déconnexion
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="pending-quotes" className="block h-full">
          <Card className="hover:bg-accent transition-colors h-full">
            <CardHeader>
              <CardTitle className="text-lg">Devis en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{quotes.length}</p>
            </CardContent>
          </Card>
        </Link>

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

      <OrderForm />
    </div>
  );
};

export default DashboardHome;
