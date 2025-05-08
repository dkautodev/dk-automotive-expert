
import React, { useState } from 'react';
import { Mail, Phone, Building } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  companyName: z.string().min(2, "Le nom de la société doit contenir au moins 2 caractères"),
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
      console.log("Sending contact form data:", values);
      
      const { data, error } = await supabase.functions.invoke(
        "send-contact-email",
        {
          body: values
        }
      );
      
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

  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-black">CONTACTEZ-NOUS POUR TOUTES</span>
                <br className="hidden md:block" />
                <span className="text-dk-navy">VOS DEMANDES</span>
              </h1>
              <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto mb-2">
                Besoin d'un devis personnalisé ? Des questions sur nos prestations de convoyage de véhicules ? Contactez-nous dès maintenant pour obtenir toutes les informations dont vous avez besoin.
              </p>
            </div>

            <div className="flex justify-center max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-dk-navy mb-6">
                  Envoyez-nous un message
                </h2>
                
                {submitError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />

                      <FormField control={form.control} name="lastName" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>

                    <FormField control={form.control} name="companyName" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Société</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre société" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />

                      <FormField control={form.control} name="phone" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="06 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>

                    <FormField control={form.control} name="subject" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Objet</FormLabel>
                          <FormControl>
                            <Input placeholder="Objet de votre message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="message" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Votre message..." className="min-h-[150px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <Button 
                      type="submit" 
                      className="w-full bg-dk-navy hover:bg-dk-blue transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ENVOI EN COURS...
                        </>
                      ) : (
                        'Envoyer le message'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};

export default Contact;
