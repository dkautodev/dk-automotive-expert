
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
import { useEffect, useState } from "react";
import { Quote } from "@/types/order";

const DashboardHome = () => {
  const [counts, setCounts] = useState({
    pendingQuotes: 0,
    ongoingShipments: 0,
    pendingInvoices: 0,
    completedShipments: 0,
  });

  useEffect(() => {
    // Récupérer les devis depuis le localStorage
    const savedQuotes = localStorage.getItem('pendingQuotes');
    if (savedQuotes) {
      const parsedQuotes = JSON.parse(savedQuotes) as Quote[];
      setCounts(prev => ({
        ...prev,
        pendingQuotes: parsedQuotes.length
      }));
    }

    // TODO: Ajouter la récupération des autres données quand elles seront implémentées
    // Pour l'instant on laisse les autres compteurs à 0
  }, []);

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
        <Link to="pending-quotes" className="block h-full">
          <Card className="hover:bg-accent transition-colors h-full">
            <CardHeader>
              <CardTitle className="text-lg">Devis en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{counts.pendingQuotes}</p>
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
