
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    if (!email || !password) {
      setErr("Veuillez saisir un email et un mot de passe.");
      setLoading(false);
      return;
    }

    try {
      // Vérifie si un utilisateur avec le même email existe déjà
      const { data: existingUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        setErr("Un administrateur existe déjà avec cet email.");
        setLoading(false);
        return;
      }

      // Hash du mot de passe
      const hash = await bcrypt.hash(password, 10);

      // Insertion dans Supabase
      const { error } = await supabase.from("admin_users").insert({
        email,
        password_hash: hash,
      });

      if (error) {
        setErr(error.message ?? "Erreur lors de la création.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Rediriger après quelque secondes
      setTimeout(() => {
        navigate("/admin");
      }, 2500);

    } catch (e: any) {
      setErr("Erreur inattendue: " + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-[#e3e6ff]">
      <form className="bg-white p-8 rounded shadow max-w-sm mx-auto w-full" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-6">Inscription nouvel admin (temporaire)</h2>
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
        {success && <div className="text-green-600 mb-4">Compte admin créé ! Redirection en cours...</div>}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Création..." : "Créer l'administrateur"}
        </Button>
      </form>
    </div>
  );
}
