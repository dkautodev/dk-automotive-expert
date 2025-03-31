
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "./types";
import { ArrowLeft, Save } from "lucide-react";

export const UserProfileDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          toast.error("Erreur lors du chargement du profil utilisateur");
          return;
        }

        // Get user email from auth.users (through function as we can't query auth directly)
        const { data: authData, error: authError } = await supabase.functions.invoke('get_user_by_id', {
          body: { userId }
        });

        if (authError) {
          console.error('Error fetching user data:', authError);
          toast.error("Erreur lors du chargement des données utilisateur");
          return;
        }

        const userData: UserData = {
          id: userId,
          email: authData?.email || '',
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          company_name: profileData?.company_name || '',
          phone: profileData?.phone || '',
          user_type: authData?.user_type || ''
        };

        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!user || !userId) return;

    setSaving(true);
    try {
      // Update profile in user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: user.first_name,
          last_name: user.last_name,
          company_name: user.company_name,
          phone: user.phone
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Consulter et modifier les informations de l'utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={user.first_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={user.last_name || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={user.email || ''}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label htmlFor="company_name">Société</Label>
              <Input
                id="company_name"
                name="company_name"
                value={user.company_name || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={user.phone || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="user_type">Type d'utilisateur</Label>
              <Input
                id="user_type"
                name="user_type"
                value={user.user_type || ''}
                readOnly
                disabled
              />
            </div>

            <Button 
              className="mt-4" 
              onClick={handleSave} 
              disabled={saving}
            >
              {saving ? <Loader className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
