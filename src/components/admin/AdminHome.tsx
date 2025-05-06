
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminHome = () => {
  const { role } = useAuthContext();

  // Only admin can access this page
  if (role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Nouvelle structure de données
            </p>
            <p className="text-xs text-muted-foreground">
              Gestion des utilisateurs simplifiée
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Base de données</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Restructurée
            </p>
            <p className="text-xs text-muted-foreground">
              Tables simplifiées pour de meilleures performances
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Unifiée
            </p>
            <p className="text-xs text-muted-foreground">
              Dashboard commun pour tous les rôles
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-4">Fonctionnalités à développer</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Gestion des missions</li>
          <li>Rapports financiers</li>
          <li>Tableaux de bord statistiques</li>
          <li>Gestion des documents</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
