
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ProfileFormData {
  email: string;
  phone: string;
}

const Profile = () => {
  const { profile } = useAuthContext();
  const form = useForm<ProfileFormData>({
    defaultValues: {
      email: profile?.email || "",
      phone: profile?.phone || "",
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email,
        phone: profile.phone || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: data.email,
          phone: data.phone,
        })
        .eq('id', profile?.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/dashboard/client">
          <ArrowLeft className="mr-2" />
          Retour au tableau de bord
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input 
                value={profile?.last_name || ""} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input 
                value={profile?.first_name || ""} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Société</Label>
              <Input 
                value={profile?.company || ""} 
                disabled 
                className="bg-gray-50"
              />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input {...field} type="email" />
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
                    <Label>Numéro de téléphone</Label>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Mettre à jour
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
