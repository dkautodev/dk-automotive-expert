
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Mail, Phone, Building, User, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { UserRole } from "@/hooks/auth/types";

interface UserData {
  id: string;
  email: string;
  created_at: string | null;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
}

const ClientManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"clients" | "drivers">("clients");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: ""
  });

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const role = activeTab === "clients" ? "client" : "chauffeur";
      
      const { data, error } = await supabase
        .rpc('get_users_with_profiles', { role_filter: role });

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Impossible de récupérer les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddUser = async () => {
    try {
      // Basic validation
      if (!newUserData.email || !validateEmail(newUserData.email)) {
        toast.error("Veuillez fournir une adresse email valide");
        return;
      }
      
      if (!newUserData.password || newUserData.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      
      if (!newUserData.firstName || !newUserData.lastName) {
        toast.error("Le prénom et le nom sont requis");
        return;
      }

      const userRole = activeTab === "clients" ? "client" : "chauffeur";
      
      const { error } = await supabase.rpc('register_user', {
        email: newUserData.email,
        password: newUserData.password,
        user_type: userRole,
        profile: {
          first_name: newUserData.firstName,
          last_name: newUserData.lastName,
          company_name: newUserData.company,
          phone: newUserData.phone
        }
      });
      
      if (error) throw error;
      
      toast.success(`${userRole === "client" ? "Client" : "Chauffeur"} ajouté avec succès`);
      // Reset form and close dialog
      setNewUserData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        company: "",
        phone: ""
      });
      setIsAddDialogOpen(false);
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete the user
      const { error } = await supabase
        .rpc('admin_delete_user', { user_id: userId });
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Utilisateur supprimé avec succès');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchLower)) ||
      (user.company && user.company.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Gérer vos clients et chauffeurs</CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter {activeTab === "clients" ? "un client" : "un chauffeur"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter {activeTab === "clients" ? "un client" : "un chauffeur"}</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer {activeTab === "clients" ? "un compte client" : "un compte chauffeur"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Prénom"
                          className="pl-10"
                          value={newUserData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Nom"
                          className="pl-10"
                          value={newUserData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        value={newUserData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mot de passe"
                      value={newUserData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Société</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="Nom de la société"
                        className="pl-10"
                        value={newUserData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Numéro de téléphone"
                        className="pl-10"
                        value={newUserData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddUser}>Créer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "clients" | "drivers")}>
            <TabsList className="grid w-[400px] max-w-full grid-cols-2">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader className="h-8 w-8" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Société</TableHead>
                    <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                    <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.company || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.phone || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet utilisateur : ${user.first_name} ${user.last_name} ?`)) {
                                handleDeleteUser(user.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun {activeTab === "clients" ? "client" : "chauffeur"} trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
