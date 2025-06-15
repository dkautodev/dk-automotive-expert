
import React, { useState } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

// L’état de session admin est géré localement (pas global ni via JWT ici)
export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-[#e3e6ff]">
      {!adminUser ? (
        <AdminLoginForm onLogin={setAdminUser} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}
