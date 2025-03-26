
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminAuth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("dkautomotive70@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, registerAdmin } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== "dkautomotive70@gmail.com") {
      toast.error("Cette page est réservée à l'administrateur");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentative d'inscription admin avec", email);
      
      const result = await registerAdmin(email, password);
      
      if (result.success) {
        toast.success(result.message);
        // Switch to login tab after successful registration
        setActiveTab('login');
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Erreur inscription admin:", error);
      toast.error(error.message || "Une erreur est survenue");
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
            <CardTitle className="text-2xl text-dk-navy">Espace Administrateur</CardTitle>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Créer un compte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-gray-700 font-medium">Email administrateur</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-gray-700 font-medium">Mot de passe administrateur</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="login-password"
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
            </TabsContent>
            
            <TabsContent value="register">
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-gray-700 font-medium">Email administrateur</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-gray-700 font-medium">Créer mot de passe administrateur</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Minimum 6 caractères"
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
                      Créez un mot de passe sécurisé pour le compte administrateur
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-dk-navy hover:bg-dk-blue"
                    disabled={isLoading}
                  >
                    {isLoading ? "Création en cours..." : "Créer compte administrateur"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="text-center justify-center">
            <p className="text-xs text-muted-foreground">
              {activeTab === 'login' 
                ? "Si vous n'avez pas encore de compte administrateur, cliquez sur 'Créer un compte'"
                : "Si vous avez déjà un compte administrateur, cliquez sur 'Connexion'"}
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} DK Automotive - Espace administrateur</p>
      </footer>
    </div>
  );
};

export default AdminAuth;
