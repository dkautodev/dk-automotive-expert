
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

type RevenueData = {
  month: string;
  revenue: number;
};

type YearlyRevenueData = {
  year: string;
  revenue: number;
};

const RevenueStatistics = () => {
  const [monthlyData, setMonthlyData] = useState<RevenueData[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyRevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPeriod, setViewPeriod] = useState<"6months" | "12months" | "yearly">("6months");

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        // Pour les données mensuelles
        const months = Array.from({ length: viewPeriod === "12months" ? 12 : 6 }, (_, i) => {
          const date = subMonths(new Date(), i);
          return {
            start: startOfMonth(date),
            end: endOfMonth(date),
            label: format(date, 'MMM yyyy', { locale: fr })
          };
        }).reverse();

        const monthlyPromises = months.map(async (month) => {
          const { data, error } = await supabase
            .from('missions')
            .select('price_ttc')
            .gte('created_at', month.start.toISOString())
            .lte('created_at', month.end.toISOString())
            .eq('status', 'livre');

          if (error) throw error;

          const revenue = data?.reduce((acc, mission) => acc + (mission.price_ttc || 0), 0) || 0;
          return { month: month.label, revenue };
        });

        const monthlyResults = await Promise.all(monthlyPromises);
        setMonthlyData(monthlyResults);

        // Pour les données annuelles
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

        const yearlyPromises = years.map(async (year) => {
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31);

          const { data, error } = await supabase
            .from('missions')
            .select('price_ttc')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .eq('status', 'livre');

          if (error) throw error;

          const revenue = data?.reduce((acc, mission) => acc + (mission.price_ttc || 0), 0) || 0;
          return { year: year.toString(), revenue };
        });

        const yearlyResults = await Promise.all(yearlyPromises);
        setYearlyData(yearlyResults);

      } catch (error) {
        console.error('Erreur lors du chargement des données de revenu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [viewPeriod]);

  const getTotalRevenue = () => {
    if (viewPeriod === "yearly") {
      return yearlyData.reduce((acc, item) => acc + item.revenue, 0);
    } else {
      return monthlyData.reduce((acc, item) => acc + item.revenue, 0);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Chiffre d'Affaires</CardTitle>
          <CardDescription>
            {viewPeriod === "6months" ? "6 derniers mois" : 
             viewPeriod === "12months" ? "12 derniers mois" : "Annuel"}
          </CardDescription>
        </div>
        <Select
          value={viewPeriod}
          onValueChange={(value: "6months" | "12months" | "yearly") => setViewPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">6 derniers mois</SelectItem>
            <SelectItem value="12months">12 derniers mois</SelectItem>
            <SelectItem value="yearly">Par année</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader className="h-8 w-8" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {viewPeriod === "yearly" ? (
              <BarChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, 'CA']} />
                <Bar dataKey="revenue" fill="#1a237e" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, 'CA']} />
                <Line type="monotone" dataKey="revenue" stroke="#1a237e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{getTotalRevenue().toFixed(2)} €</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RevenueStatistics;
