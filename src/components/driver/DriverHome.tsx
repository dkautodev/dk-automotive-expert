import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, CheckCircle, CircleDollarSign, ChevronRight, BarChart, CalendarClock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from '@/services/mockSupabaseClient';
import { Loader } from "@/components/ui/loader";

// Composant pour l'indicateur de performance du chauffeur
const PerformanceIndicator = ({ value, label, icon, description, trend }: { 
  value: string | number;
  label: string;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
}) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-base">{label}</CardTitle>
        {icon}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{value}</span>
        {trend && (
          <div className={`text-xs flex items-center ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {trend === 'stable' && '→ '}
            {trend === 'up' ? '+10%' : 
             trend === 'down' ? '-5%' : 
             'stable'}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const DriverHome = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    assignedMissions: 0,
    completedMissions: 0,
    inProgressMissions: 0,
    pendingMissions: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0,
    averageRating: 4.8,
    efficiency: 95
  });
  const [recentMissions, setRecentMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [performancePeriod, setPerformancePeriod] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    if (user) {
      fetchDriverStats();
      fetchRecentMissions();
      fetchChartData(performancePeriod);
    }
  }, [user, performancePeriod]);

  const fetchDriverStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id);

      if (error) throw error;

      const missionsList = data || [];
      const assigned = missionsList ? missionsList.length : 0;
      const completed = missionsList ? missionsList.filter(m => m.status === 'termine').length : 0;
      const inProgress = missionsList ? missionsList.filter(m => m.status === 'prise_en_charge').length : 0;
      const pending = missionsList ? missionsList.filter(m => m.status === 'confirme' || m.status === 'confirmé').length : 0;
      
      // Calculer les revenus mensuels
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      
      const monthlyMissions = missionsList.filter(mission => {
        const date = mission.created_at ? parseISO(mission.created_at) : null;
        return date && isWithinInterval(date, { start: monthStart, end: monthEnd });
      });
      
      const yearlyMissions = missionsList.filter(mission => {
        const date = mission.created_at ? parseISO(mission.created_at) : null;
        return date && isWithinInterval(date, { start: yearStart, end: yearEnd });
      });
      
      const monthlyEarnings = monthlyMissions.reduce((sum, mission) => sum + (mission.price_ht || 0), 0);
      const yearlyEarnings = yearlyMissions.reduce((sum, mission) => sum + (mission.price_ht || 0), 0);

      setStats({
        assignedMissions: assigned,
        completedMissions: completed,
        inProgressMissions: inProgress,
        pendingMissions: pending,
        monthlyEarnings,
        yearlyEarnings,
        averageRating: 4.8, // Fictif pour l'exemple
        efficiency: 95 // Fictif pour l'exemple
      });
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Ensure all required fields exist
      const typedData: MissionRow[] = (data || []).map(item => ({
        ...item as any,
        pickup_address: (item as any).pickup_address || "",
        delivery_address: (item as any).delivery_address || "",
      }));
      
      setRecentMissions(typedData);
    } catch (error) {
      console.error('Error fetching recent missions:', error);
    }
  };

  const fetchChartData = async (period: "week" | "month" | "year") => {
    try {
      setLoadingChart(true);
      
      // Récupérer les données de mission
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id);
        
      if (error) throw error;
      
      let chartData: any[] = [];
      
      if (period === "week") {
        // Données pour les 7 derniers jours
        const days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date,
            name: format(date, 'EEE', { locale: fr }),
            fullDate: format(date, 'yyyy-MM-dd')
          };
        }).reverse();
        
        chartData = days.map(day => {
          const dayMissions = data.filter(mission => {
            const missionDate = mission.created_at ? parseISO(mission.created_at) : null;
            return missionDate && format(missionDate, 'yyyy-MM-dd') === day.fullDate;
          });
          
          return {
            name: day.name,
            missions: dayMissions.length,
            earnings: dayMissions.reduce((sum, mission) => sum + (mission.price_ht || 0), 0)
          };
        });
      } else if (period === "month") {
        // Données pour les 30 derniers jours regroupées par semaine
        const weeks = Array.from({ length: 4 }, (_, i) => {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          return {
            startDate,
            endDate,
            name: `S${4-i}`
          };
        }).reverse();
        
        chartData = weeks.map(week => {
          const weekMissions = data.filter(mission => {
            const missionDate = mission.created_at ? parseISO(mission.created_at) : null;
            return missionDate && 
              isWithinInterval(missionDate, { start: week.startDate, end: week.endDate });
          });
          
          return {
            name: week.name,
            missions: weekMissions.length,
            earnings: weekMissions.reduce((sum, mission) => sum + (mission.price_ht || 0), 0)
          };
        });
      } else {
        // Données pour les 12 derniers mois
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            date,
            name: format(date, 'MMM', { locale: fr }),
            year: date.getFullYear(),
            month: date.getMonth()
          };
        }).reverse();
        
        chartData = months.map(month => {
          const monthMissions = data.filter(mission => {
            const missionDate = mission.created_at ? parseISO(mission.created_at) : null;
            return missionDate && 
              missionDate.getMonth() === month.month && 
              missionDate.getFullYear() === month.year;
          });
          
          return {
            name: month.name,
            missions: monthMissions.length,
            earnings: monthMissions.reduce((sum, mission) => sum + (mission.price_ht || 0), 0)
          };
        });
      }
      
      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoadingChart(false);
    }
  };

  if (loading) {
    return <Loader className="mx-auto my-12" />;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Chauffeur</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace chauffeur.</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter variant="compact" />
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/driver/profile">
              Mon profil
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceIndicator 
          value={stats.assignedMissions}
          label="Missions assignées"
          icon={<Truck className="h-5 w-5 text-primary" />}
          description="Total de vos missions"
          trend="up"
        />
        <PerformanceIndicator 
          value={stats.inProgressMissions}
          label="En cours"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Missions en cours"
        />
        <PerformanceIndicator 
          value={stats.completedMissions}
          label="Complétées"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Missions terminées"
          trend="up"
        />
        <PerformanceIndicator 
          value={`${stats.monthlyEarnings.toFixed(2)}€`}
          label="CA du mois"
          icon={<CircleDollarSign className="h-5 w-5 text-emerald-500" />}
          description="Total HT"
          trend="stable"
        />
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Suivi de vos missions et revenus</CardDescription>
              </div>
              <Select 
                value={performancePeriod}
                onValueChange={(value: "week" | "month" | "year") => setPerformancePeriod(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loadingChart ? (
              <div className="h-72 flex items-center justify-center">
                <Loader className="h-8 w-8" />
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#18257D" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'earnings') return [`${value}€`, 'Revenus'];
                        if (name === 'missions') return [value, 'Missions'];
                        return [value, name];
                      }}
                    />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="earnings" 
                      name="Revenus" 
                      stroke="#18257D" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="missions" 
                      name="Missions" 
                      stroke="#10b981"
                      strokeWidth={2}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Prochaines livraisons</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMissions.filter(m => m.status === 'prise_en_charge').length > 0 ? (
                <div className="space-y-3">
                  {recentMissions
                    .filter(m => m.status === 'prise_en_charge')
                    .slice(0, 2)
                    .map(mission => (
                      <div key={mission.id} className="flex items-start justify-between border-b pb-2 last:border-b-0 last:pb-0">
                        <div>
                          <p className="font-medium text-sm truncate">
                            {mission.mission_number || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {mission.delivery_address}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-primary">
                            {mission.delivery_date ? 
                              format(new Date(mission.delivery_date), "dd/MM", { locale: fr }) : 
                              'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Aucune livraison en cours
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Statistiques annuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenus</span>
                  <span className="font-medium">{stats.yearlyEarnings.toFixed(2)}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Missions terminées</span>
                  <span className="font-medium">{stats.completedMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Note moyenne</span>
                  <span className="font-medium">{stats.averageRating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Efficacité</span>
                  <span className="font-medium">{stats.efficiency}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Missions */}
      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
          <CardDescription>Vos dernières missions assignées</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMissions.length > 0 ? (
            <div className="space-y-4">
              {recentMissions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{mission.mission_number || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-md">
                      {mission.pickup_address || 'Adresse non spécifiée'} → {mission.delivery_address || 'Adresse non spécifiée'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExtendedMissionStatusBadge status={mission.status} />
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}

              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/dashboard/driver/missions">Voir toutes les missions</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>Aucune mission ne vous a été assignée pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverHome;
