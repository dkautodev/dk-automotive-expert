import { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from '@/services/mockSupabaseClient';
import { MissionRow } from "@/types/database";
import { MissionStatusBadge } from "../client/MissionStatusBadge";
import { format, startOfMonth, endOfMonth, subMonths, parseISO, isWithinInterval, getDaysInMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { CircleDollarSign, Calendar, LineChart, PlusCircle, TrendingUp, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DriverEarnings = () => {
  const { user } = useAuthContext();
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthIndex, setMonthIndex] = useState(0); // 0 for current month, 1 for previous month, etc.

  const currentDate = new Date();
  const selectedMonth = subMonths(currentDate, monthIndex);
  const startDate = startOfMonth(selectedMonth);
  const endDate = endOfMonth(selectedMonth);

  useEffect(() => {
    if (user) {
      fetchAllMissions();
    }
  }, [user]);

  const fetchAllMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData: MissionRow[] = (data || []).map(item => ({
        ...item as any,
        pickup_address: (item as any).pickup_address || "",
        delivery_address: (item as any).delivery_address || "",
      }));
      
      setMissions(typedData);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Impossible de récupérer vos missions');
    } finally {
      setLoading(false);
    }
  };

  const monthlyMissions = missions.filter(mission => {
    if (!mission.created_at) return false;
    
    try {
      const missionDate = parseISO(mission.created_at);
      return isWithinInterval(missionDate, { start: startDate, end: endDate });
    } catch (e) {
      return false;
    }
  });

  const monthlyStats = useMemo(() => {
    const completedMissions = monthlyMissions.filter(m => m.status === 'termine' || m.status === 'livre');
    
    const totalEarnings = completedMissions.reduce((sum, mission) => {
      return sum + (mission.price_ht || 0);
    }, 0);
    
    return {
      totalMissions: monthlyMissions.length,
      completedMissions: completedMissions.length,
      totalEarnings,
      averageMissionValue: completedMissions.length > 0 ? totalEarnings / completedMissions.length : 0
    };
  }, [monthlyMissions]);

  const daysInMonth = getDaysInMonth(selectedMonth);
  const dailyEarningsData = useMemo(() => {
    const earnings = Array(daysInMonth).fill(0);
    
    monthlyMissions.forEach(mission => {
      if (!mission.created_at || !mission.price_ht) return;
      
      try {
        const date = parseISO(mission.created_at);
        const day = date.getDate() - 1; // Adjust to 0-based index
        earnings[day] += mission.price_ht;
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      montant: earnings[i]
    }));
  }, [monthlyMissions, daysInMonth, selectedMonth]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes revenus</h1>
        <p className="text-muted-foreground">Suivez vos revenus mensuels</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">
            {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
          </span>
        </div>
        
        <Select 
          value={monthIndex.toString()} 
          onValueChange={(value) => setMonthIndex(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un mois" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(12)].map((_, i) => {
              const month = subMonths(currentDate, i);
              return (
                <SelectItem key={i} value={i.toString()}>
                  {format(month, 'MMMM yyyy', { locale: fr })}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenu mensuel</CardTitle>
                <CardDescription>Total HT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{monthlyStats.totalEarnings.toFixed(2)}€</span>
                  <CircleDollarSign className="h-8 w-8 text-emerald-500 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Missions du mois</CardTitle>
                <CardDescription>Total: {monthlyStats.totalMissions}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{monthlyStats.completedMissions}</span>
                  <PlusCircle className="h-8 w-8 text-blue-500 opacity-80" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Missions terminées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Valeur moyenne</CardTitle>
                <CardDescription>Par mission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{monthlyStats.averageMissionValue.toFixed(2)}€</span>
                  <TrendingUp className="h-8 w-8 text-purple-500 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Revenus journaliers
              </CardTitle>
              <CardDescription>Évolution des revenus pour {format(selectedMonth, 'MMMM yyyy', { locale: fr })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {dailyEarningsData.some(data => data.montant > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyEarningsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 25,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        label={{ value: 'Jour du mois', position: 'bottom' }}
                      />
                      <YAxis 
                        label={{ value: 'Montant (€)', angle: -90, position: 'left' }}
                      />
                      <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                      <Legend />
                      <Bar dataKey="montant" name="Montant (€)" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Aucun revenu à afficher pour cette période</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détail des missions</CardTitle>
              <CardDescription>Liste des missions pour {format(selectedMonth, 'MMMM yyyy', { locale: fr })}</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyMissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>N° Mission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Montant HT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyMissions.map((mission) => (
                        <TableRow key={mission.id}>
                          <TableCell>{formatDate(mission.created_at)}</TableCell>
                          <TableCell>{mission.mission_number || 'N/A'}</TableCell>
                          <TableCell><MissionStatusBadge status={mission.status} /></TableCell>
                          <TableCell>{mission.price_ht ? `${mission.price_ht.toFixed(2)} €` : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucune mission pour cette période</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DriverEarnings;
