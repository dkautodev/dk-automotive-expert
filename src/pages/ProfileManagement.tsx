
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { toast } from "sonner";
import { UserTable } from "@/components/admin/clients/UserTable";

// Define the basic profile data without nested relations
type ProfileType = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company_name?: string | null;
  phone?: string | null;
  profile_picture?: string | null;
  billing_address?: string | null;
  siret_number?: string | null;
  vat_number?: string | null;
  email?: string;
  user_type?: string;
};

const ProfileManagement = () => {
  const [clientProfiles, setClientProfiles] = useState<ProfileType[]>([]);
  const [driverProfiles, setDriverProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Début de la récupération des profils...");
        
        // Approche alternative pour récupérer les profils
        // D'abord, récupérer tous les profils utilisateurs
        const { data: allProfiles, error: profilesError } = await extendedSupabase
          .from('user_profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        
        console.log("Profils récupérés:", allProfiles?.length || 0, "profils trouvés");
        
        if (!allProfiles || allProfiles.length === 0) {
          setError("Aucun profil trouvé dans la base de données");
          setClientProfiles([]);
          setDriverProfiles([]);
          setLoading(false);
          return;
        }
        
        // Ensuite, récupérer les informations utilisateurs pour avoir les emails et les types
        const userIds = allProfiles.map(profile => profile.user_id);
        
        const { data: usersData, error: usersError } = await extendedSupabase
          .from('users')
          .select('id, email, user_type')
          .in('id', userIds);
        
        if (usersError) throw usersError;
        
        console.log("Données utilisateurs récupérées:", usersData?.length || 0, "utilisateurs trouvés");
        
        // Combiner les données pour avoir des profils complets
        const combinedProfiles = allProfiles.map(profile => {
          const userData = usersData?.find(user => user.id === profile.user_id);
          return {
            ...profile,
            email: userData?.email || '',
            user_type: userData?.user_type || ''
          };
        });
        
        console.log("Profils combinés:", combinedProfiles);
        
        // Filtrer les clients et les chauffeurs
        const clients = combinedProfiles.filter(profile => profile.user_type === 'client');
        const drivers = combinedProfiles.filter(profile => profile.user_type === 'chauffeur');
        
        console.log(`Filtrage terminé: ${clients.length} clients et ${drivers.length} chauffeurs trouvés`);
        
        setClientProfiles(clients);
        setDriverProfiles(drivers);
      } catch (error: any) {
        console.error('Erreur lors de la récupération des profils:', error);
        setError(`Erreur: ${error.message}`);
        toast.error(`Erreur lors du chargement des profils: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const formatProfilesForUserTable = (profiles: ProfileType[]) => {
    return profiles.map(profile => ({
      id: profile.user_id || profile.id,
      email: profile.email || '',
      user_type: profile.user_type || 'client',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      company_name: profile.company_name || '',
      phone: profile.phone || '',
    }));
  };

  const handleDeleteUser = (user: any) => {
    console.log("Delete user:", user);
    // Implementation can be added later
    toast.info("Fonctionnalité de suppression à implémenter");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des profils</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Profils Clients</CardTitle>
              <CardDescription>
                Gérer les profils des clients 
                {clientProfiles.length > 0 && ` (${clientProfiles.length} clients trouvés)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <Loader className="h-6 w-6" />
                </div>
              ) : (
                <UserTable 
                  users={formatProfilesForUserTable(clientProfiles)} 
                  loading={false} 
                  handleDeleteUser={handleDeleteUser} 
                  isDeleting={false}
                  userType="client"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Profils Chauffeurs</CardTitle>
              <CardDescription>
                Gérer les profils des chauffeurs
                {driverProfiles.length > 0 && ` (${driverProfiles.length} chauffeurs trouvés)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <Loader className="h-6 w-6" />
                </div>
              ) : (
                <UserTable 
                  users={formatProfilesForUserTable(driverProfiles)} 
                  loading={false} 
                  handleDeleteUser={handleDeleteUser} 
                  isDeleting={false}
                  userType="chauffeur"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileManagement;
