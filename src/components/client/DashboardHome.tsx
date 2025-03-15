
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

const DashboardHome = () => {
  const handleLogout = () => {
    // TODO: Implement logout logic
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
        <Link to="pending-quotes">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle>Devis en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="ongoing-shipments">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle>Convoyages en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Convoyages terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>

        <Link to="pending-invoices">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-6 w-6" />
                Factures en attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <OrderForm />
    </div>
  );
};

export default DashboardHome;
