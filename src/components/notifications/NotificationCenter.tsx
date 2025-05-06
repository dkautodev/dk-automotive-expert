
import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { NotificationRow } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export interface Notification extends NotificationRow {
  formattedDate?: string;
}

interface NotificationCenterProps {
  variant?: "default" | "outline" | "compact";
}

export const NotificationCenter = ({ variant = "default" }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return;
    
    const loadNotifications = async () => {
      try {
        const { data, error } = await extendedSupabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) {
          console.error("Erreur lors du chargement des notifications:", error);
          return;
        }
        
        if (data) {
          const formattedNotifications = data.map(notification => ({
            ...notification,
            formattedDate: format(new Date(notification.created_at), "PPp", { locale: fr })
          }));
          
          setNotifications(formattedNotifications);
          setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      }
    };
    
    loadNotifications();
    
    // Abonnement aux nouvelles notifications en temps réel
    const channel = extendedSupabase
      .channel('notifications-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}` 
      }, payload => {
        const newNotification = {
          ...(payload.new as Notification),
          formattedDate: format(new Date((payload.new as Notification).created_at), "PPp", { locale: fr })
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Notification système pour alerter l'utilisateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('DK Automotive', {
            body: newNotification.message,
            icon: '/dk-automotive-logo.png'
          });
        }
      })
      .subscribe();
      
    return () => {
      extendedSupabase.removeChannel(channel);
    };
  }, [user]);
  
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };
  
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
        
      if (unreadIds.length === 0) return;
      
      const { error } = await extendedSupabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);
        
      if (error) {
        console.error("Erreur lors du marquage des notifications comme lues:", error);
        return;
      }
      
      // Mise à jour locale
      setNotifications(prev => 
        prev.map(n => unreadIds.includes(n.id) ? { ...n, read: true } : n)
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur lors du marquage des notifications comme lues:", error);
    }
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await extendedSupabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) {
        console.error("Erreur lors du marquage de la notification comme lue:", error);
        return;
      }
      
      // Mise à jour locale
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lue
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigation contextuelle selon le type de notification
    if (notification.mission_id && notification.type === 'mission_status') {
      if (role === 'admin') {
        navigate(`/dashboard/admin/missions/${notification.mission_id}`);
      } else if (role === 'chauffeur') {
        navigate(`/dashboard/driver/missions`);
      } else {
        navigate(`/dashboard/client/mission-history`);
      }
    }
    
    setIsOpen(false);
  };
  
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'mission_status':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'invoice':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'alert':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };
  
  const filterNotifications = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant === "compact" ? "ghost" : "outline"} 
          size={variant === "compact" ? "icon" : "default"}
          className="relative"
          onClick={requestNotificationPermission}
        >
          <Bell size={variant === "compact" ? 18 : 16} className={variant !== "compact" ? "mr-2" : ""} />
          {variant !== "compact" && "Notifications"}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs">Toutes</TabsTrigger>
            <TabsTrigger value="mission_status" className="flex-1 text-xs">Missions</TabsTrigger>
            <TabsTrigger value="invoice" className="flex-1 text-xs">Factures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <NotificationList 
              notifications={filterNotifications('all')} 
              getNotificationTypeIcon={getNotificationTypeIcon}
              handleNotificationClick={handleNotificationClick}
            />
          </TabsContent>
          
          <TabsContent value="mission_status">
            <NotificationList 
              notifications={filterNotifications('mission_status')} 
              getNotificationTypeIcon={getNotificationTypeIcon}
              handleNotificationClick={handleNotificationClick}
            />
          </TabsContent>
          
          <TabsContent value="invoice">
            <NotificationList 
              notifications={filterNotifications('invoice')} 
              getNotificationTypeIcon={getNotificationTypeIcon}
              handleNotificationClick={handleNotificationClick}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  getNotificationTypeIcon: (type: string) => React.ReactNode;
  handleNotificationClick: (notification: Notification) => void;
}

const NotificationList = ({ 
  notifications, 
  getNotificationTypeIcon, 
  handleNotificationClick 
}: NotificationListProps) => {
  return (
    <ScrollArea className="max-h-[300px]">
      {notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 hover:bg-muted cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  {getNotificationTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.formattedDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          Aucune notification
        </div>
      )}
    </ScrollArea>
  );
};

export default NotificationCenter;
