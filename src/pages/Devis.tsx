import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Devis = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="animate-fadeIn">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-dk-navy mb-4">Obtenir un devis personnalisé</h1>
              <p className="text-lg text-gray-600">
                Remplissez le formulaire ci-dessous pour recevoir votre devis sur mesure
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulaire de demande de devis</CardTitle>
                <CardDescription>
                  Nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Le formulaire sera implémenté dans la prochaine étape */}
                  <p className="text-center text-gray-500">
                    Le formulaire de devis sera bientôt disponible
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-dk-navy hover:bg-dk-blue">
                      Demander mon devis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Devis;
