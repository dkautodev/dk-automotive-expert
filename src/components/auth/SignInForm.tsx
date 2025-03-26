
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof formSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      console.log("Tentative de connexion avec", data.email);
      
      // Si c'est l'admin
      if (data.email === 'dkautomotive70@gmail.com') {
        console.log("Tentative de connexion admin");
        try {
          await signIn(data.email, data.password);
          toast.success("Connexion administrateur réussie");
          navigate('/dashboard/admin');
          return;
        } catch (error: any) {
          console.error("Erreur connexion admin:", error);
          
          // Si le mot de passe est correct mais qu'il y a un problème avec Supabase
          if (data.password === 'adminadmin70') {
            toast.error("Problème de connexion: " + error.message);
          } else {
            toast.error("Mot de passe incorrect pour l'administrateur");
          }
          setIsLoading(false);
          return;
        }
      }
      
      // Pour les autres utilisateurs, connexion normale
      try {
        await signIn(data.email, data.password);
        toast.success("Connexion réussie");
        navigate('/dashboard/client');
      } catch (error: any) {
        console.error("Erreur connexion:", error);
        toast.error(error.message || "Identifiants invalides. Veuillez vérifier votre email et mot de passe.");
      } finally {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Erreur générale:", error);
      toast.error(error.message || "Une erreur est survenue lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Connexion Professionnel</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace professionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="votre@email.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-dk-navy hover:bg-dk-blue"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <Link 
          to="/admin-auth" 
          className="text-xs text-muted-foreground hover:text-dk-navy flex items-center gap-1 transition-colors"
        >
          <ShieldCheck size={14} />
          Espace administrateur
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
