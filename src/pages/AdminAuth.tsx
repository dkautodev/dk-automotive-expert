
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

const AdminAuth = () => {
  const [email, setEmail] = useState("dkautomotive70@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== "dkautomotive70@gmail.com") {
      toast.error("Cette page est réservée à l'administrateur");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentative de connexion admin avec", email);
      
      await signIn(email, password);
      toast.success("Connexion administrateur réussie");
      navigate("/dashboard/admin");
    } catch (error: any) {
      console.error("Erreur connexion admin:", error);
      toast.error(error.message || "Identifiants invalides");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-dk-navy text-white p-4 text-center">
        <h1 className="text-2xl font-bold">DK Automotive</h1>
        <p className="text-sm">Espace Administrateur</p>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-dk-navy border-t-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-dk-navy">Connexion Administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium">Email administrateur</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-700 font-medium">Mot de passe administrateur</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Utilisez le mot de passe administrateur fourni par DK Automotive
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-dk-navy hover:bg-dk-blue"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} DK Automotive - Espace administrateur</p>
      </footer>
    </div>
  );
};

export default AdminAuth;
