
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, isAuthenticated } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[118px]">
      <SEO title="Connexion Administrateur" noIndex={true} />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            alt="DK Automotive" 
            className="h-12 w-auto object-fill mx-auto mb-4" 
            src="/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png" 
          />
          <CardTitle className="text-2xl font-bold text-dk-navy">Espace Administrateur</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  id="email" 
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
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  id="password" 
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
