
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        throw error;
      }

      toast.success("Instructions de réinitialisation envoyées à votre e-mail");
      onCancel(); // Retourner à l'écran de connexion
    } catch (error: any) {
      console.error("Erreur réinitialisation:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'envoi des instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Réinitialisation du mot de passe</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Nous vous enverrons un lien pour réinitialiser votre mot de passe
        </p>
      </div>

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

          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Retour à la connexion
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
