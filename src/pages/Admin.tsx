
import React, { useState } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

// L’état de session admin est géré localement (pas global ni via JWT ici)
export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  let content = null;
  try {
    if (!adminUser) {
      content = <AdminLoginForm onLogin={setAdminUser} />;
    } else {
      content = <AdminDashboard />;
    }
  } catch (e) {
    setError("Erreur de rendu du composant Admin. Vérifiez la console ou l'import bcryptjs.");
    content = null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-[#e3e6ff]">
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">Erreur : {error}</div>
      ) : content}
    </div>
  );
}
