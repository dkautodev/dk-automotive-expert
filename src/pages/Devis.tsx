import React from 'react';
import QuoteForm from '@/components/quote-form/QuoteForm';
const Devis = () => {
  return <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-fadeIn">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-dk-navy mb-8">Obtenez un devis immédiat</h1>
          <QuoteForm />
        </div>
      </main>
    </div>;
};
export default Devis;