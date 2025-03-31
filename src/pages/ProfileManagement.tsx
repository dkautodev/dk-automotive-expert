
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { toast } from "sonner";
import { UserTable } from "@/components/admin/clients/UserTable";

type ProfileType = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  phone?: string;
  profile_picture?: string;
  billing_address?: string;
  siret_number?: string;
  vat_number?: string;
  email?: string;
  user_type?: string;
  users?: {
    email?: string;
    user_type?: string;
  };
};

const ProfileManagement = () => {
  const [clientProfiles, setClientProfiles] = useState<ProfileType[]>([]);
  const [driverProfiles, setDriverProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Fetch client profiles
        const { data: clientData, error: clientError } = await extendedSupabase
          .from('user_profiles')
          .select('*, users(email, user_type)')
          .eq('user_type', 'client');
        
        if (clientError) throw clientError;
        
        // Fetch driver profiles
        const { data: driverData, error: driverError } = await extendedSupabase
          .from('user_profiles')
          .select('*, users(email, user_type)')
          .eq('user_type', 'chauffeur');
        
        if (driverError) throw driverError;
        
        // Map data to include email
        const mapProfiles = (profiles: any[]) => profiles.map(profile => {
          return {
            ...profile,
            email: profile.users?.email || '',
            user_type: profile.users?.user_type || profile.user_type || 'client'
          };
        });
        
        setClientProfiles(mapProfiles(clientData || []));
        setDriverProfiles(mapProfiles(driverData || []));
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
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
      
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Profils Clients</CardTitle>
              <CardDescription>Gérer les profils des clients</CardDescription>
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
              <CardDescription>Gérer les profils des chauffeurs</CardDescription>
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
