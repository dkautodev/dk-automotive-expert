
import { User, ListOrdered } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Mon profil",
    icon: User,
    url: "/dashboard/client/profile",
  },
  {
    title: "Historique des commandes",
    icon: ListOrdered,
    url: "/dashboard/client/orders",
  },
];

export function ClientSidebar() {
  const location = useLocation();
  const { profile } = useAuthContext();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-4 space-y-2">
          <p className="text-sm font-medium text-foreground/70">
            {profile?.company || 'Société non renseignée'}
          </p>
          <p className="text-sm text-foreground/70">
            {profile?.first_name} {profile?.last_name}
          </p>
          <p className="text-sm text-foreground/70">
            {profile?.email}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
