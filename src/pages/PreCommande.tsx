import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';

interface QuoteData {
  pickup_address?: string;
  delivery_address?: string;
  vehicle_type?: string;
  brand?: string;
  model?: string;
  year?: string;
  fuel?: string;
  licensePlate?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  distance?: string;
  price_ht?: string;
  price_ttc?: string;
  additionalInfo?: string;
}

const PreCommande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quoteData = location.state as QuoteData | null;

  if (!quoteData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 animate-fadeIn">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-dk-navy mb-4">Aucune donnée de devis</h2>
                <p className="text-gray-600 mb-6">
                  Veuillez d'abord remplir le formulaire de devis pour accéder à la pré-commande.
                </p>
                <Button onClick={() => navigate('/devis')} className="bg-dk-navy hover:bg-dk-blue">
                  Retour au formulaire de devis
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-fadeIn">
        <div className="container mx-auto px-4 py-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/devis')} 
            className="mb-6 text-dk-navy hover:text-dk-blue"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au formulaire de devis
          </Button>

          <h1 className="text-3xl font-bold text-dk-navy mb-8">Pré-commander votre convoyage</h1>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Récapitulatif des informations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-dk-navy">Récapitulatif de votre demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trajet */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-dk-navy">Trajet</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Départ:</span>
                      <p className="font-medium">{quoteData.pickup_address || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Arrivée:</span>
                      <p className="font-medium">{quoteData.delivery_address || 'Non renseigné'}</p>
                    </div>
                    {quoteData.distance && (
                      <div>
                        <span className="text-sm text-gray-500">Distance:</span>
                        <p className="font-medium">{quoteData.distance} km</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Véhicule */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-dk-navy">Véhicule</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Catégorie:</span>
                      <p className="font-medium">{quoteData.vehicle_type || 'Non renseigné'}</p>
                    </div>
                    {(quoteData.brand || quoteData.model) && (
                      <div>
                        <span className="text-sm text-gray-500">Véhicule:</span>
                        <p className="font-medium">
                          {[quoteData.brand, quoteData.model, quoteData.year].filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    {quoteData.licensePlate && (
                      <div>
                        <span className="text-sm text-gray-500">Immatriculation:</span>
                        <p className="font-medium">{quoteData.licensePlate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-dk-navy">Contact</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {quoteData.company && (
                      <div>
                        <span className="text-sm text-gray-500">Société:</span>
                        <p className="font-medium">{quoteData.company}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Nom:</span>
                      <p className="font-medium">{quoteData.firstName} {quoteData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{quoteData.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Téléphone:</span>
                      <p className="font-medium">{quoteData.phone}</p>
                    </div>
                  </div>
                </div>

                {quoteData.additionalInfo && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-dk-navy">Informations complémentaires</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{quoteData.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section paiement */}
            <Card className="border-2 border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement sécurisé
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Tarifs */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Prix HT:</span>
                    <span className="font-semibold text-lg">{quoteData.price_ht || 'À confirmer'} €</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-gray-800 font-medium">Prix TTC:</span>
                    <span className="font-bold text-xl text-green-600">{quoteData.price_ttc || 'À confirmer'} €</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Le paiement Stripe sera bientôt disponible. 
                    Notre équipe vous contactera pour finaliser votre pré-commande.
                  </p>
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  disabled
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payer maintenant (Bientôt disponible)
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Paiement sécurisé par Stripe. Vos données bancaires sont protégées.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreCommande;
