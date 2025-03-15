
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-center text-dk-navy mb-8">
              Contactez-nous
            </h1>
            
            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-dk-navy" />
                <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-dk-navy" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contact@dk-automotive.fr</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-dk-navy" />
                <h3 className="text-xl font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600">123 Rue de Paris, 75001 Paris</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-dk-navy mb-6">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <Input id="name" placeholder="Votre nom" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="votre@email.com" className="w-full" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <Input id="subject" placeholder="Sujet de votre message" className="w-full" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Votre message..." 
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-dk-navy hover:bg-dk-blue transition-colors">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
