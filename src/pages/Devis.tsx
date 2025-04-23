
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/quote-form/QuoteForm';

const Devis = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-dk-navy mb-8">Demande de devis</h1>
          <QuoteForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Devis;
