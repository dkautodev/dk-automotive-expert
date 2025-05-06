
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, User, PlusCircle, Book, Users, Settings, LogOut
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const AppSidebar = () => {
  const location = useLocation();
  const { user, profile, role, signOut } = useAuthContext();
  const isMobile = useIsMobile();
  const [initials, setInitials] = useState("...");

  useEffect(() => {
    if (profile) {
      const firstInitial = profile.firstName ? profile.firstName.charAt(0) : '';
      const lastInitial = profile.lastName ? profile.lastName.charAt(0) : '';
      setInitials((firstInitial + lastInitial).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?');
    }
  }, [profile, user]);

  // Define menu items based on user role
  const menuItems = [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
    { label: "Contacts", icon: <Book className="h-5 w-5" />, path: "/dashboard/contacts" },
    { label: "Profil", icon: <User className="h-5 w-5" />, path: "/dashboard/profile" },
  ];

  // Add admin-specific items
  if (role === 'admin') {
    menuItems.splice(2, 0, { 
      label: "Utilisateurs", 
      icon: <Users className="h-5 w-5" />, 
      path: "/dashboard/users" 
    });
    menuItems.push({ 
      label: "Paramètres", 
      icon: <Settings className="h-5 w-5" />, 
      path: "/dashboard/settings" 
    });
  }

  return (
    <>
      {isMobile ? (
        <Sidebar className="p-4 border-r border-gray-100">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <Link to="/" className="font-bold text-xl">DK Automotive</Link>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500" 
                onClick={signOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Déconnexion</span>
              </Button>
              <div className="flex items-center mt-4 space-x-2">
                <Avatar>
                  <AvatarImage src={profile?.avatarUrl || ''} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {profile?.firstName} {profile?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{profile?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
      ) : (
        <div className="fixed top-0 left-0 w-52 h-full border-r border-gray-100 bg-white z-40">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <Link to="/" className="font-bold text-xl">DK Automotive</Link>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500" 
                onClick={signOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Déconnexion</span>
              </Button>
              <div className="flex items-center mt-4 space-x-2">
                <Avatar>
                  <AvatarImage src={profile?.avatarUrl || ''} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {profile?.firstName} {profile?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{profile?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
