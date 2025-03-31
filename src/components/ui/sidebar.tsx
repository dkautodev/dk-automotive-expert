
import * as React from "react";

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

export const SidebarTrigger = () => {
  const { toggleCollapsed } = useSidebar();
  return (
    <button onClick={toggleCollapsed}>
      Toggle Sidebar
    </button>
  );
};
