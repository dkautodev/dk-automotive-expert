import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const Devis = () => {
  return <div className="min-h-screen bg-white">
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
              
              
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Devis;