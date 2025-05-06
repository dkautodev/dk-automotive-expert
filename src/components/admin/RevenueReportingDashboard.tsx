
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, 
  Cell, Sector 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth, endOfMonth, addMonths, setMonth, setYear, getYear, getMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, FileDown, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type RevenueData = {
  month: string;
  revenue: number;
  count: number;
};

type YearlyRevenueData = {
  year: string;
  revenue: number;
  count: number;
};

type StatusDistributionData = {
  name: string;
  value: number;
  color: string;
};

type ClientRevenueData = {
  clientName: string;
  revenue: number;
};

type DateRangeType = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'lastQuarter' | 'thisYear' | 'lastYear' | 'custom';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS = {
  'en_attente': '#3b82f6',  // blue
  'confirme': '#10b981',    // green
  'confirmé': '#10b981',    // green
  'prise_en_charge': '#f59e0b', // amber
  'livre': '#6366f1',       // indigo
  'termine': '#059669',     // emerald
  'annule': '#ef4444',      // red
  'annulé': '#ef4444',      // red
  'incident': '#f43f5e'     // rose
};

const RevenueReportingDashboard = () => {
  const [viewPeriod, setViewPeriod] = useState<"monthly" | "yearly" | "clients" | "status">("monthly");
  const [monthlyData, setMonthlyData] = useState<RevenueData[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyRevenueData[]>([]);
  const [statusData, setStatusData] = useState<StatusDistributionData[]>([]);
  const [clientsData, setClientsData] = useState<ClientRevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('thisMonth');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Déterminer la plage de dates en fonction du type sélectionné
    let fromDate: Date;
    let toDate: Date = new Date();
    
    switch (dateRangeType) {
      case 'thisMonth':
        fromDate = startOfMonth(new Date());
        toDate = endOfMonth(new Date());
        break;
      case 'lastMonth':
        fromDate = startOfMonth(subMonths(new Date(), 1));
        toDate = endOfMonth(subMonths(new Date(), 1));
        break;
      case 'thisQuarter':
        const currentMonth = getMonth(new Date());
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        fromDate = startOfMonth(setMonth(new Date(), quarterStartMonth));
        toDate = endOfMonth(setMonth(new Date(), quarterStartMonth + 2));
        break;
      case 'lastQuarter':
        const lastMonth = getMonth(new Date());
        const lastQuarterStartMonth = Math.floor(lastMonth / 3) * 3 - 3;
        fromDate = startOfMonth(setMonth(new Date(), lastQuarterStartMonth));
        toDate = endOfMonth(setMonth(new Date(), lastQuarterStartMonth + 2));
        break;
      case 'thisYear':
        fromDate = new Date(getYear(new Date()), 0, 1);
        toDate = new Date(getYear(new Date()), 11, 31);
        break;
      case 'lastYear':
        fromDate = new Date(getYear(new Date()) - 1, 0, 1);
        toDate = new Date(getYear(new Date()) - 1, 11, 31);
        break;
      case 'custom':
        fromDate = dateRange.from || startOfMonth(new Date());
        toDate = dateRange.to || endOfMonth(new Date());
        break;
      default:
        fromDate = startOfMonth(new Date());
        toDate = endOfMonth(new Date());
    }
    
    setDateRange({ from: fromDate, to: toDate });
    fetchData(fromDate, toDate);
    
  }, [dateRangeType, viewPeriod]);

  const fetchData = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    try {
      if (viewPeriod === "monthly") {
        await fetchMonthlyData(fromDate, toDate);
      } else if (viewPeriod === "yearly") {
        await fetchYearlyData();
      } else if (viewPeriod === "status") {
        await fetchStatusDistribution(fromDate, toDate);
      } else if (viewPeriod === "clients") {
        await fetchTopClients(fromDate, toDate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async (fromDate: Date, toDate: Date) => {
    const { data: missions, error } = await supabase
      .from('missions')
      .select('price_ttc, created_at')
      .gte('created_at', fromDate.toISOString())
      .lte('created_at', toDate.toISOString())
      .order('created_at');

    if (error) {
      console.error('Erreur lors de la récupération des missions:', error);
      return;
    }

    // Regrouper par mois
    const monthlyRevenue = missions.reduce((acc, mission) => {
      const date = new Date(mission.created_at);
      const monthKey = format(date, 'MMM yyyy', { locale: fr });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { revenue: 0, count: 0 };
      }
      
      acc[monthKey].revenue += mission.price_ttc || 0;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { revenue: number, count: number }>);
    
    // Convertir en tableau pour le graphique
    const formattedData = Object.entries(monthlyRevenue).map(([month, data]) => ({
      month,
      revenue: parseFloat(data.revenue.toFixed(2)),
      count: data.count
    }));
    
    setMonthlyData(formattedData);
  };

  const fetchYearlyData = async () => {
    const currentYear = getYear(new Date());
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();
    
    const yearlyPromises = years.map(async (year) => {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const { data: missions, error } = await supabase
        .from('missions')
        .select('price_ttc')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error(`Erreur pour l'année ${year}:`, error);
        return { year: year.toString(), revenue: 0, count: 0 };
      }

      const revenue = missions.reduce((sum, mission) => sum + (mission.price_ttc || 0), 0);
      
      return { 
        year: year.toString(), 
        revenue: parseFloat(revenue.toFixed(2)),
        count: missions.length
      };
    });

    const yearlyResults = await Promise.all(yearlyPromises);
    setYearlyData(yearlyResults);
  };

  const fetchStatusDistribution = async (fromDate: Date, toDate: Date) => {
    const { data: missions, error } = await supabase
      .from('missions')
      .select('status')
      .gte('created_at', fromDate.toISOString())
      .lte('created_at', toDate.toISOString());

    if (error) {
      console.error('Erreur lors de la récupération du statut des missions:', error);
      return;
    }

    // Regrouper par statut
    const statusCounts: Record<string, number> = {};
    missions.forEach(mission => {
      const status = mission.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Convertir en tableau pour le graphique
    const formattedData = Object.entries(statusCounts).map(([name, value]) => ({
      name: getStatusLabel(name),
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#888888'
    }));
    
    setStatusData(formattedData);
  };

  const fetchTopClients = async (fromDate: Date, toDate: Date) => {
    // First, get missions with client info
    const { data: missions, error } = await supabase
      .from('missions')
      .select(`
        price_ttc,
        client_id,
        clientProfile:client_id (
          first_name,
          last_name,
          company_name,
          client_code
        )
      `)
      .gte('created_at', fromDate.toISOString())
      .lte('created_at', toDate.toISOString());

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      return;
    }

    // Group by client
    const clientsRevenue: Record<string, { revenue: number, name: string }> = {};
    
    missions.forEach(mission => {
      if (!mission.clientProfile || !mission.client_id) return;
      
      const clientName = getClientName(mission.clientProfile);
      if (!clientsRevenue[mission.client_id]) {
        clientsRevenue[mission.client_id] = { revenue: 0, name: clientName };
      }
      
      clientsRevenue[mission.client_id].revenue += mission.price_ttc || 0;
    });
    
    // Convert to array and sort by revenue
    const sortedClients = Object.values(clientsRevenue)
      .map(client => ({
        clientName: client.name,
        revenue: parseFloat(client.revenue.toFixed(2))
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 clients
    
    setClientsData(sortedClients);
  };

  const getClientName = (clientProfile: any) => {
    if (!clientProfile) return 'Client inconnu';
    
    if (clientProfile.client_code) return clientProfile.client_code;
    if (clientProfile.company_name) return clientProfile.company_name;
    
    const fullName = `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim();
    return fullName || 'Client sans nom';
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirme': return 'Confirmée';
      case 'confirmé': return 'Confirmée';
      case 'prise_en_charge': return 'Prise en charge';
      case 'livre': return 'Livrée';
      case 'termine': return 'Terminée';
      case 'annule': return 'Annulée';
      case 'annulé': return 'Annulée';
      case 'incident': return 'Incident';
      default: return status;
    }
  };

  const getDateRangeText = (): string => {
    if (!dateRange.from) return 'Sélectionnez une plage de dates';
    
    let text = '';
    switch (dateRangeType) {
      case 'thisMonth':
        text = `Ce mois (${format(dateRange.from, 'MMMM yyyy', { locale: fr })})`;
        break;
      case 'lastMonth':
        text = `Mois dernier (${format(dateRange.from, 'MMMM yyyy', { locale: fr })})`;
        break;
      case 'thisQuarter':
        text = `Ce trimestre (${format(dateRange.from, 'MMM', { locale: fr })} - ${format(dateRange.to!, 'MMM yyyy', { locale: fr })})`;
        break;
      case 'lastQuarter':
        text = `Trimestre dernier (${format(dateRange.from, 'MMM', { locale: fr })} - ${format(dateRange.to!, 'MMM yyyy', { locale: fr })})`;
        break;
      case 'thisYear':
        text = `Cette année (${format(dateRange.from, 'yyyy')})`;
        break;
      case 'lastYear':
        text = `Année dernière (${format(dateRange.from, 'yyyy')})`;
        break;
      case 'custom':
        text = `${format(dateRange.from, 'dd/MM/yyyy')} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : 'maintenant'}`;
        break;
    }
    return text;
  };

  const handleDateRangeChange = (range: DateRange) => {
    if (range.from) {
      setDateRange(range);
      if (range.to) {
        fetchData(range.from, range.to);
      }
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} missions`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const getTotalRevenue = () => {
    if (viewPeriod === "monthly") {
      return monthlyData.reduce((acc, item) => acc + item.revenue, 0);
    } else if (viewPeriod === "yearly") {
      return yearlyData.reduce((acc, item) => acc + item.revenue, 0);
    } else if (viewPeriod === "clients") {
      return clientsData.reduce((acc, item) => acc + item.revenue, 0);
    }
    return 0;
  };

  const getTotalMissions = () => {
    if (viewPeriod === "monthly") {
      return monthlyData.reduce((acc, item) => acc + item.count, 0);
    } else if (viewPeriod === "yearly") {
      return yearlyData.reduce((acc, item) => acc + item.count, 0);
    } else if (viewPeriod === "status") {
      return statusData.reduce((acc, item) => acc + item.value, 0);
    }
    return 0;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analyse des Revenus</CardTitle>
          <CardDescription>
            Suivi des missions et du chiffre d'affaires
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">{getDateRangeText()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <h4 className="font-medium">Période</h4>
              </div>
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={dateRangeType === 'thisMonth' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('thisMonth')}
                  >
                    Ce mois
                  </Button>
                  <Button 
                    variant={dateRangeType === 'lastMonth' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('lastMonth')}
                  >
                    Mois dernier
                  </Button>
                  <Button 
                    variant={dateRangeType === 'thisQuarter' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('thisQuarter')}
                  >
                    Ce trimestre
                  </Button>
                  <Button 
                    variant={dateRangeType === 'lastQuarter' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('lastQuarter')}
                  >
                    Trim. dernier
                  </Button>
                  <Button 
                    variant={dateRangeType === 'thisYear' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('thisYear')}
                  >
                    Cette année
                  </Button>
                  <Button 
                    variant={dateRangeType === 'lastYear' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setDateRangeType('lastYear')}
                  >
                    Année dernière
                  </Button>
                </div>
                
                <div className="pt-3 border-t">
                  <h4 className="font-medium mb-2">Personnalisé</h4>
                  <div>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range) {
                          setDateRangeType('custom');
                          handleDateRangeChange(range);
                        }
                      }}
                      className="rounded-md border"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select
            value={viewPeriod}
            onValueChange={(value: "monthly" | "yearly" | "clients" | "status") => setViewPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Par mois</SelectItem>
              <SelectItem value="yearly">Par année</SelectItem>
              <SelectItem value="clients">Top clients</SelectItem>
              <SelectItem value="status">Par statut</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader className="h-8 w-8" />
          </div>
        ) : (
          <div className="h-full">
            {viewPeriod === "monthly" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`${value} €`, 'CA'];
                      if (name === 'count') return [`${value}`, 'Missions'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Chiffre d'affaires" fill="#18257D" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="count" name="Nombre de missions" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {viewPeriod === "yearly" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`${value} €`, 'CA'];
                      if (name === 'count') return [`${value}`, 'Missions'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Chiffre d'affaires" fill="#18257D" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="count" name="Nombre de missions" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {viewPeriod === "status" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {viewPeriod === "clients" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientsData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="clientName" 
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip formatter={(value) => [`${value} €`, 'CA']} />
                  <Bar dataKey="revenue" fill="#18257D" radius={[0, 4, 4, 0]}>
                    {clientsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total CA</span>
              <p className="text-xl font-bold">{getTotalRevenue().toFixed(2)} €</p>
            </div>
            <div className="hidden md:block h-8 w-px bg-muted"></div>
            <div>
              <span className="text-sm text-muted-foreground">Nombre de missions</span>
              <p className="text-xl font-bold">{getTotalMissions()}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {getDateRangeText()}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RevenueReportingDashboard;
