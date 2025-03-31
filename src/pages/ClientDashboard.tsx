
import { Outlet } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileMenuToggle } from "@/components/ui/sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { UpdateMissionStatus } from "@/components/client/UpdateMissionStatus";
import { useLocation } from "react-router-dom";

const ClientDashboard = () => {
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useMobile();
  const location = useLocation();
  const isRootPath = location.pathname === "/dashboard/client";
  
  return (
    <div className="flex h-screen">
      <ClientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        {isMobile && (
          <div className="bg-background p-4 border-b">
            <MobileMenuToggle
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="block lg:hidden"
            />
          </div>
        )}
        <ScrollArea className="flex-1 p-0 h-[calc(100vh-64px)]">
          {isRootPath && (
            <UpdateMissionStatus />
          )}
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ClientDashboard;
