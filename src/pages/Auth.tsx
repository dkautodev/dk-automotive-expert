
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error('Erreur de connexion: ' + error.message);
      }
    } else {
      toast.success('Connexion réussie !');
      navigate('/admin');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      if (error.message === 'User already registered') {
        toast.error('Un compte existe déjà avec cet email');
      } else {
        toast.error('Erreur d\'inscription: ' + error.message);
      }
    } else {
      toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      setActiveTab('signin');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[118px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            alt="DK Automotive" 
            className="h-12 w-auto object-fill mx-auto mb-4" 
            src="/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png" 
          />
          <CardTitle className="text-2xl font-bold text-dk-navy">Espace Administrateur</CardTitle>
          <CardDescription>
            Connectez-vous ou créez votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="admin@dkautomotive.fr" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="signin-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-dk-navy hover:bg-dk-blue" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="admin@dkautomotive.fr" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="pl-10" 
                      required 
                      minLength={6}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Minimum 6 caractères
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-dk-navy hover:bg-dk-blue" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Inscription...
                    </>
                  ) : (
                    'Créer un compte'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Espace réservé aux administrateurs - DK Automotive
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
