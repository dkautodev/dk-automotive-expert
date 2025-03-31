
import { Link, useLocation } from "react-router-dom";
import { Truck, User, FileText, DollarSign, LogOut, PlusCircle, LayoutDashboard, FileBox } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

const DriverSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut } = useAuthContext();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Vous avez été déconnecté avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la déconnexion");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-14 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold">
          <Truck className="h-5 w-5 text-dk-navy" />
          <span className="text-dk-navy">DK Automotive</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={currentPath === "/dashboard/driver" ? "bg-accent" : ""}>
                  <Link to="/dashboard/driver" className="flex items-center gap-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Tableau de bord</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={currentPath.includes("/dashboard/driver/missions") ? "bg-accent" : ""}>
                  <Link to="/dashboard/driver/missions" className="flex items-center gap-3">
                    <Truck className="h-5 w-5" />
                    <span>Mes missions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={currentPath.includes("/dashboard/driver/earnings") ? "bg-accent" : ""}>
                  <Link to="/dashboard/driver/earnings" className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5" />
                    <span>Mes revenus</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={currentPath.includes("/dashboard/driver/documents") ? "bg-accent" : ""}>
                  <Link to="/dashboard/driver/documents" className="flex items-center gap-3">
                    <FileBox className="h-5 w-5" />
                    <span>Mes documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={currentPath.includes("/dashboard/driver/profile") ? "bg-accent" : ""}>
                  <Link to="/dashboard/driver/profile" className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>Mon profil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-6 py-4">
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DriverSidebar;
