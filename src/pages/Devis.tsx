
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';

const Devis = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="animate-fadeIn">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-dk-navy mb-4">Obtenir un devis personnalisé sous 24h</h1>
              <p className="text-lg text-gray-600">
                Veuillez renseigner les champs ci-dessous
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <QuoteForm />
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
