
import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Sidebar component export
export function Sidebar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();
  
  return (
    <aside
      className={cn(
        "h-screen bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export const SidebarTrigger = () => {
  const { toggleCollapsed } = useSidebar();
  return (
    <Button variant="ghost" onClick={toggleCollapsed} className="p-1 h-8 w-8">
      <Menu className="h-5 w-5" />
    </Button>
  );
};

// Ajout du composant MobileMenuToggle qui était manquant
export const MobileMenuToggle = () => {
  const { toggleCollapsed } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
};
