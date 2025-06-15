
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLoginFormProps {
  onLogin: (adminUser: { id: string; email: string }) => void;
}

export default function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    // Récupération de l’admin user via l’email
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      setErr("Identifiants invalides");
      setLoading(false);
      return;
    }
    const passwordCorrect = await bcrypt.compare(password, data.password_hash);
    if (!passwordCorrect) {
      setErr("Identifiants invalides");
      setLoading(false);
      return;
    }
    onLogin({ id: data.id, email: data.email });
    setLoading(false);
  };

  return (
    <form className="bg-white p-8 rounded shadow max-w-sm mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-6">Connexion administrateur</h2>
      <div className="mb-4">
        <Input
          placeholder="Adresse email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {err && <div className="text-red-500 mb-4">{err}</div>}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
