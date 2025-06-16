
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Lock, LogOut, BarChart3, FileText, Truck, Settings, Euro, Home, HelpCircle, Scale, Shield, Cookie } from 'lucide-react';
import IndexPageEditor from '@/components/admin/IndexPageEditor';
import FaqEditor from '@/components/admin/FaqEditor';
import LegalMentionsEditor from '@/components/admin/LegalMentionsEditor';
import PrivacyPolicyEditor from '@/components/admin/PrivacyPolicyEditor';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('accueil');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'une connexion
    console.log('Tentative de connexion:', {
      email,
      password
    });

    // Simulation d'un délai de traitement
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('accueil');
  };

  // Données simulées
  const stats = [{
    title: 'Devis en attente',
    value: 12,
    icon: FileText,
    color: 'text-orange-600'
  }, {
    title: 'Missions actives',
    value: 8,
    icon: Truck,
    color: 'text-blue-600'
  }, {
    title: 'Revenus du mois',
    value: '15,420€',
    icon: Euro,
    color: 'text-green-600'
  }, {
    title: 'Taux de conversion',
    value: '68%',
    icon: BarChart3,
    color: 'text-purple-600'
  }];
  const recentQuotes = [{
    id: 1,
    client: 'Jean Dupont',
    pickup: 'Paris',
    delivery: 'Lyon',
    vehicle: 'BMW X5',
    status: 'En attente',
    date: '2024-01-15'
  }, {
    id: 2,
    client: 'Marie Martin',
    pickup: 'Marseille',
    delivery: 'Nice',
    vehicle: 'Audi A4',
    status: 'Accepté',
    date: '2024-01-14'
  }, {
    id: 3,
    client: 'Pierre Durand',
    pickup: 'Toulouse',
    delivery: 'Bordeaux',
    vehicle: 'Mercedes C200',
    status: 'En cours',
    date: '2024-01-13'
  }, {
    id: 4,
    client: 'Sophie Blanc',
    pickup: 'Lille',
    delivery: 'Strasbourg',
    vehicle: 'Peugeot 3008',
    status: 'Terminé',
    date: '2024-01-12'
  }];
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
      'En attente': 'secondary',
      'Accepté': 'default',
      'En cours': 'default',
      'Terminé': 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // Page de connexion
  if (!isLoggedIn) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-dk-navy">Administration</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="email" type="email" placeholder="admin@exemple.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <Button type="submit" className="w-full bg-dk-navy hover:bg-dk-blue" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Interface d'administration - DK Automotive
              </p>
            </div>
          </CardContent>
        </Card>
      </div>;
  }

  // Dashboard admin
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b pt-[98px] py-[55px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-0">
            <div>
              <h1 className="text-2xl font-bold text-dk-navy">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">DK Automotive - Gestion</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[{
            id: 'accueil',
            label: 'Accueil',
            icon: Home
          }, {
            id: 'faq',
            label: 'FAQ',
            icon: HelpCircle
          }, {
            id: 'mentions-legales',
            label: 'Mentions légales',
            icon: FileText
          }, {
            id: 'politique-confidentialite',
            label: 'Politique de confidentialité',
            icon: Shield
          }, {
            id: 'gestion-cookies',
            label: 'Gestion de cookies',
            icon: Cookie
          }, {
            id: 'cgv',
            label: 'CGV',
            icon: Scale
          }, {
            id: 'cgu',
            label: 'CGU',
            icon: Scale
          }, {
            id: 'espace-professionnel',
            label: 'Espace professionnel',
            icon: User
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? 'border-dk-navy text-dk-navy' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>)}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'accueil' && <IndexPageEditor />}
        {activeTab === 'faq' && <FaqEditor />}
        {activeTab === 'mentions-legales' && <LegalMentionsEditor />}
        {activeTab === 'politique-confidentialite' && <PrivacyPolicyEditor />}
        {activeTab !== 'accueil' && activeTab !== 'faq' && activeTab !== 'mentions-legales' && activeTab !== 'politique-confidentialite' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Section en cours de développement
              </h2>
              <p className="text-gray-500">
                L'édition de la section "{activeTab}" sera bientôt disponible.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>;
};

export default Admin;
