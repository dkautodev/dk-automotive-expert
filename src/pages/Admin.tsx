
import React, { useState } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

// L’état de session admin est géré localement (pas global ni via JWT ici)
export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log("RENDER AdminPage -- adminUser :", adminUser);

  let content = null;
  try {
    if (!adminUser) {
      // debug :
      console.log("Affichage du formulaire de connexion...");
      content = <AdminLoginForm onLogin={setAdminUser} />;
    } else {
      console.log("Affichage du dashboard admin...");
      content = <AdminDashboard />;
    }
  } catch (e: any) {
    setError("Erreur de rendu du composant Admin. Vérifiez la console ou l'import bcryptjs. Err : " + e.message);
    content = <div className="bg-red-100 text-red-700 p-4 rounded">
      Erreur lors du rendu du composant Admin : {e.message}
    </div>;
    console.error(e);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-[#e3e6ff]">
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">Erreur : {error}</div>
      ) : content}
    </div>
  );
}
