
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Placeholder components for the new routes
const Profile = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
    <p>Contenu du profil à venir...</p>
  </div>
);

const OrderHistory = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Historique des commandes</h2>
    <p>Historique des commandes à venir...</p>
  </div>
);

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Convoyages en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Convoyages terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devis en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
