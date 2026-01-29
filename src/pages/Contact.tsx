import React, { useState } from 'react';
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
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Contact" 
        description="Contactez DK Automotive pour toutes vos demandes de convoyage de véhicules. Notre équipe vous répond rapidement pour un service personnalisé."
        canonical="https://dkautomotive.fr/contact"
      />
      
      <main className="flex-1 animate-fadeIn">
        {/* Hero Section */}
        <section className="relative bg-dk-navy py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Contactez-nous
              </h1>
              <p className="text-white/90 text-base md:text-lg font-light leading-relaxed mb-8">
                Besoin d'un devis personnalisé ? Des questions sur nos prestations ? 
                Notre équipe est à votre écoute.
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Réponse rapide</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Du lundi au vendredi</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Conseil gratuit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-dk-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-dk-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dk-navy mb-1">Email</h3>
                        <a 
                          href="mailto:contact@dkautomotive.fr" 
                          className="text-muted-foreground hover:text-dk-navy transition-colors text-sm"
                        >
                          contact@dkautomotive.fr
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-dk-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-dk-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dk-navy mb-1">Téléphone</h3>
                        <p className="text-muted-foreground text-sm">
                          Du lundi au vendredi
                        </p>
                        <p className="text-muted-foreground text-sm">
                          9h - 18h
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-dk-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-dk-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dk-navy mb-1">Zone d'intervention</h3>
                        <p className="text-muted-foreground text-sm">
                          France entière
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border">
                    {/* Form Header */}
                    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border">
                      <div className="w-10 h-10 bg-dk-navy/10 rounded-lg flex items-center justify-center">
                        <Send className="w-5 h-5 text-dk-navy" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-dk-navy">Envoyez-nous un message</h2>
                        <p className="text-sm text-muted-foreground">Nous vous répondrons dans les plus brefs délais</p>
                      </div>
                    </div>
                    
                    {submitError && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField 
                            control={form.control} 
                            name="firstName" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-dk-navy font-semibold">
                                  PRÉNOM <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Votre prénom" 
                                    className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />

                          <FormField 
                            control={form.control} 
                            name="lastName" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-dk-navy font-semibold">
                                  NOM <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Votre nom" 
                                    className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />
                        </div>

                        <FormField 
                          control={form.control} 
                          name="companyName" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-dk-navy font-semibold">
                                SOCIÉTÉ <span className="text-muted-foreground text-xs font-normal">(facultatif)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nom de votre société" 
                                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField 
                            control={form.control} 
                            name="email" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-dk-navy font-semibold">
                                  EMAIL <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="votre@email.com" 
                                    className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />

                          <FormField 
                            control={form.control} 
                            name="phone" 
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-dk-navy font-semibold">
                                  TÉLÉPHONE <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="06 12 34 56 78" 
                                    className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} 
                          />
                        </div>

                        <FormField 
                          control={form.control} 
                          name="subject" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-dk-navy font-semibold">
                                OBJET <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Objet de votre message" 
                                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <FormField 
                          control={form.control} 
                          name="message" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-dk-navy font-semibold">
                                MESSAGE <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Décrivez votre demande..." 
                                  className="bg-muted/50 border-border focus-visible:ring-dk-navy min-h-[120px] resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full bg-dk-navy hover:bg-dk-blue text-white py-5 text-base transition-colors" 
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ENVOI EN COURS...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Envoyer le message
                              </>
                            )}
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold text-dk-navy mb-4">
                Besoin d'un devis rapidement ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Utilisez notre calculateur en ligne pour obtenir un tarif instantané.
              </p>
              <a href="/devis">
                <Button className="bg-dk-navy hover:bg-dk-blue text-white px-8 py-5 text-base">
                  Demander un devis gratuit
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
