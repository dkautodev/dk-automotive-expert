
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserTable } from "@/components/admin/clients/UserTable";
import { edgeFunctionService } from "@/components/admin/clients/services/api/edgeFunctionService";

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
        console.log("Début de la récupération des profils via Edge Function...");
        
        // Utiliser l'Edge Function pour récupérer les utilisateurs avec profils
        const response = await edgeFunctionService.fetchUsersViaEdgeFunction();
        
        if (!response) {
          console.log("Pas de réponse de l'Edge Function, essayons les méthodes alternatives");
          await fetchProfilesDirectly();
          return;
        }
        
        console.log("Réponse de l'Edge Function:", response);
        
        if (response.clients?.length > 0 || response.drivers?.length > 0) {
          console.log(`Edge Function: ${response.clients?.length || 0} clients et ${response.drivers?.length || 0} chauffeurs trouvés`);
          
          // Transformer les données en format ProfileType
          const formattedClients = response.clients?.map(client => ({
            id: client.id,
            user_id: client.id,
            first_name: client.first_name || '',
            last_name: client.last_name || '',
            company_name: client.company_name || '',
            phone: client.phone || '',
            email: client.email || '',
            user_type: 'client'
          })) || [];
          
          const formattedDrivers = response.drivers?.map(driver => ({
            id: driver.id,
            user_id: driver.id,
            first_name: driver.first_name || '',
            last_name: driver.last_name || '',
            company_name: driver.company_name || '',
            phone: driver.phone || '',
            email: driver.email || '',
            user_type: 'chauffeur'
          })) || [];
          
          setClientProfiles(formattedClients);
          setDriverProfiles(formattedDrivers);
          setLoading(false);
        } else {
          console.log("Aucun utilisateur trouvé via l'Edge Function, essayons les méthodes alternatives");
          await fetchProfilesDirectly();
        }
      } catch (error: any) {
        console.error("Erreur lors de la récupération via Edge Function:", error);
        await fetchProfilesDirectly();
      }
    };

    const fetchProfilesDirectly = async () => {
      try {
        console.log("Tentative de récupération directe des profils...");
        
        // 1. Récupérer tous les profils d'utilisateurs
        const { data: allProfiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*');
        
        if (profilesError) {
          throw profilesError;
        }
        
        console.log("Profils récupérés directement:", allProfiles?.length || 0);
        
        if (!allProfiles || allProfiles.length === 0) {
          setError("Aucun profil trouvé dans la base de données");
          setClientProfiles([]);
          setDriverProfiles([]);
          setLoading(false);
          return;
        }

        // 2. Récupérer les informations des utilisateurs (via auth.users n'est pas possible directement)
        // Alternative: vérifier si nous avons la table 'users' dans la base de données
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, user_type');
        
        if (usersError) {
          console.warn("Erreur lors de la récupération des utilisateurs:", usersError);
          console.log("Utilisation des profils sans informations d'email");
        }
        
        console.log("Données utilisateurs récupérées:", usersData?.length || 0);
        
        // 3. Combiner les données
        const combinedProfiles = allProfiles.map(profile => {
          const userData = usersData?.find(user => user.id === profile.user_id);
          
          // Si nous n'avons pas de type d'utilisateur, utiliser 'client' par défaut
          const userType = userData?.user_type || 'client';
          
          return {
            ...profile,
            id: profile.id,
            user_id: profile.user_id || profile.id,
            email: userData?.email || '',
            user_type: userType
          };
        });
        
        console.log("Profils combinés:", combinedProfiles.length);
        
        // 4. Filtrer les clients et chauffeurs
        const clients = combinedProfiles.filter(profile => !profile.user_type || profile.user_type === 'client');
        const drivers = combinedProfiles.filter(profile => profile.user_type === 'chauffeur');
        
        console.log(`Filtrage terminé: ${clients.length} clients et ${drivers.length} chauffeurs trouvés`);
        
        setClientProfiles(clients);
        setDriverProfiles(drivers);
      } catch (error: any) {
        console.error('Erreur lors de la récupération directe des profils:', error);
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
