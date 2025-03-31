
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { NotificationRow } from "@/types/database";

export type Notification = NotificationRow;

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthContext();
  
  useEffect(() => {
    if (!user) return;
    
    // Charger les notifications
    const loadNotifications = async () => {
      try {
        const { data, error } = await extendedSupabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Erreur lors du chargement des notifications:", error);
          return;
        }
        
        if (data) {
          setNotifications(data as Notification[]);
          setUnreadCount(data.filter(n => !n.read).length);
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
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();
      
    return () => {
      extendedSupabase.removeChannel(channel);
    };
  }, [user]);
  
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
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2 h-8 w-8">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              Marquer tout comme lu
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune notification
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
