
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, BarChart3, FileText, Truck, Settings, Euro, Home, HelpCircle, Scale, Shield, Cookie, User, Image, Lock, Users, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import IndexPageEditor from '@/components/admin/IndexPageEditor';
import AboutPageEditor from '@/components/admin/AboutPageEditor';
import FaqEditor from '@/components/admin/FaqEditor';
import LegalMentionsEditor from '@/components/admin/LegalMentionsEditor';
import PrivacyPolicyEditor from '@/components/admin/PrivacyPolicyEditor';
import CookieManagementEditor from '@/components/admin/CookieManagementEditor';
import CgvEditor from '@/components/admin/CgvEditor';
import CguEditor from '@/components/admin/CguEditor';
import ProfessionalSpaceEditor from '@/components/admin/ProfessionalSpaceEditor';
import LogoEditor from '@/components/admin/LogoEditor';
import PasswordEditor from '@/components/admin/PasswordEditor';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Données simulées pour le dashboard
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b pt-[98px] py-[55px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-0">
              <div>
                <h1 className="text-2xl font-bold text-dk-navy">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">
                  Connecté en tant que : {user?.email} - DK Automotive
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/pilote">
                  <Button variant="default" className="flex items-center gap-2 bg-dk-navy hover:bg-dk-navy/90">
                    <Navigation className="w-4 h-4" />
                    Pilote
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </div>
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
                id: 'a-propos',
                label: 'À propos',
                icon: Users
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
              }, {
                id: 'logo',
                label: 'Logo',
                icon: Image
              }, {
                id: 'mot-de-passe',
                label: 'Mot de passe',
                icon: Lock
              }].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-dk-navy text-dk-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          {activeTab === 'accueil' && <IndexPageEditor />}
          {activeTab === 'a-propos' && <AboutPageEditor />}
          {activeTab === 'faq' && <FaqEditor />}
          {activeTab === 'mentions-legales' && <LegalMentionsEditor />}
          {activeTab === 'politique-confidentialite' && <PrivacyPolicyEditor />}
          {activeTab === 'gestion-cookies' && <CookieManagementEditor />}
          {activeTab === 'cgv' && <CgvEditor />}
          {activeTab === 'cgu' && <CguEditor />}
          {activeTab === 'espace-professionnel' && <ProfessionalSpaceEditor />}
          {activeTab === 'logo' && <LogoEditor />}
          {activeTab === 'mot-de-passe' && <PasswordEditor />}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
