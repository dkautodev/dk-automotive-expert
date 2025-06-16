import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Lock, LogOut, BarChart3, FileText, Truck, Settings, Euro } from 'lucide-react';
const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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
    setActiveTab('dashboard');
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
          <div className="flex space-x-8">
            {[{
            id: 'dashboard',
            label: 'Tableau de bord',
            icon: BarChart3
          }, {
            id: 'quotes',
            label: 'Devis',
            icon: FileText
          }, {
            id: 'missions',
            label: 'Missions',
            icon: Truck
          }, {
            id: 'settings',
            label: 'Paramètres',
            icon: Settings
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-dk-navy text-dk-navy' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>)}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Recent Quotes Table */}
            <Card>
              <CardHeader>
                <CardTitle>Devis récents</CardTitle>
                <CardDescription>Liste des dernières demandes de devis</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Enlèvement</TableHead>
                      <TableHead>Livraison</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentQuotes.map(quote => <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.client}</TableCell>
                        <TableCell>{quote.pickup}</TableCell>
                        <TableCell>{quote.delivery}</TableCell>
                        <TableCell>{quote.vehicle}</TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>{quote.date}</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>}

        {activeTab === 'quotes' && <Card>
            <CardHeader>
              <CardTitle>Gestion des Devis</CardTitle>
              <CardDescription>Gérez toutes les demandes de devis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Interface de gestion des devis à développer...</p>
            </CardContent>
          </Card>}

        {activeTab === 'missions' && <Card>
            <CardHeader>
              <CardTitle>Gestion des Missions</CardTitle>
              <CardDescription>Suivi des missions de convoyage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Interface de gestion des missions à développer...</p>
            </CardContent>
          </Card>}

        {activeTab === 'settings' && <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>Configuration de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Interface de paramètres à développer...</p>
            </CardContent>
          </Card>}
      </main>
    </div>;
};
export default Admin;