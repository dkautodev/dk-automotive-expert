import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Building, Send, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import Hero from '@/components/common/Hero';
const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  companyName: z.string().optional(),
  subject: z.string().min(2, "L'objet doit contenir au moins 2 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères")
});
const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      subject: "",
      message: ""
    }
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("send-contact-email", {
        body: values
      });
      if (error) {
        throw new Error(error.message || "Erreur lors de l'envoi du message");
      }
      toast.success("Message envoyé avec succès !");
      form.reset();
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      const errorMessage = error.message || "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contactez DK Automotive",
    "description": "Contactez DK Automotive pour toutes vos demandes de convoyage de véhicules en France. Obtenez un devis personnalisé ou une réponse à vos questions.",
    "url": "https://www.dkautomotive.fr/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "DK Automotive",
      "logo": "https://app-private.dkautomotive.fr/upload/4922f807-dfd8-4cf6-b440-ee35efade638.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+33123456789", // Placeholder, ideally should come from config
        "contactType": "customer service",
        "email": "contact@dkautomotive.fr"
      }
    }
  };

  return <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Contact" description="Contactez DK Automotive pour toutes vos demandes de convoyage de véhicules. Notre équipe vous répond rapidement pour un service personnalisé." canonical="https://www.dkautomotive.fr/contact" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <main className="flex-1 animate-fadeIn">
        {/* Hero Section */}
        <Hero
          title="Contactez-nous"
          description="Besoin d'un devis personnalisé ? Des questions sur nos prestations ? Notre équipe est à votre écoute."
          backgroundImage="/upload/51603c32-87b6-4e5d-ab03-7352caca679d.png"
          height="min-h-[350px] md:min-h-[450px]"
        >
          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 md:gap-8 mt-8">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium tracking-wide uppercase">Réponse rapide</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium tracking-wide uppercase">Du lundi au vendredi</span>
            </div>
          </div>
        </Hero>

        {/* Contact Section */}
        <section className="section-spacing bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Contact Form */}
              <div className="premium-card p-8 md:p-10">
                    {/* Form Header */}
                    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border">
                      <div className="w-10 h-10 bg-dk-navy/10 rounded-lg flex items-center justify-center">
                        <Send className="w-5 h-5 text-dk-navy" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-dk-navy">Envoyez-nous un message</h2>
                        <p className="text-sm text-muted-foreground mt-1">Nous vous répondrons dans les plus brefs délais</p>
                      </div>
                    </div>
                    
                    {submitError && <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>}
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={form.control} name="firstName" render={({
                          field
                        }) => <FormItem>
                                <FormLabel className="text-dk-navy font-semibold text-sm">
                                  Prénom <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre prénom" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />

                          <FormField control={form.control} name="lastName" render={({
                          field
                        }) => <FormItem>
                                <FormLabel className="text-dk-navy font-semibold text-sm">
                                  Nom <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre nom" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>

                        <FormField control={form.control} name="companyName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-dk-navy font-semibold text-sm">
                                Société <span className="text-muted-foreground text-xs font-normal">(facultatif)</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Nom de votre société" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={form.control} name="email" render={({
                          field
                        }) => <FormItem>
                                <FormLabel className="text-dk-navy font-semibold text-sm">
                                  Email <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="votre@email.com" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />

                          <FormField control={form.control} name="phone" render={({
                          field
                        }) => <FormItem>
                                <FormLabel className="text-dk-navy font-semibold text-sm">
                                  Téléphone <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="06 12 34 56 78" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>

                        <FormField control={form.control} name="subject" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-dk-navy font-semibold text-sm">
                                Objet <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Objet de votre message" className="bg-muted/50 border-border focus-visible:ring-dk-navy" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        <FormField control={form.control} name="message" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-dk-navy font-semibold text-sm">
                                Message <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea placeholder="Décrivez votre demande..." className="bg-muted/50 border-border focus-visible:ring-dk-navy min-h-[120px] resize-none" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        <div className="pt-2">
                          <Button type="submit" className="w-full btn-premium bg-dk-navy hover:bg-dk-blue text-white py-6" disabled={loading}>
                            {loading ? <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                              </> : <>
                                <Send className="mr-2 h-4 w-4" />
                                Envoyer le message
                              </>}
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          <span className="text-destructive">*</span> Champs obligatoires
                        </p>
                      </form>
                    </Form>
                  </div>
              </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-4">
                Besoin d'un devis rapidement ?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Utilisez notre calculateur en ligne pour obtenir un tarif instantané.
              </p>
              <Link to="/devis">
                <Button className="btn-premium bg-dk-navy hover:bg-dk-blue text-white px-10 py-6">
                  Demander un devis gratuit
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>;
};
export default Contact;