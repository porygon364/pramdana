import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';
import { Loader2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";

interface Transaction {
  amount: number;
  category: string;
  transaction_date: string;
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
  is_active: boolean;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
}

interface MonthlySpending {
  month: string;
  amount: number;
}

interface AnalyticsData {
  categoryBreakdown: CategoryBreakdown[];
  monthlySpending: MonthlySpending[];
  totalSpent: number;
  averageSpent: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C43', '#FF6B6B', '#4ECDC4'];

const TransactionAnalytics = () => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    categoryBreakdown: [],
    monthlySpending: [],
    totalSpent: 0,
    averageSpent: 0
  });

  useEffect(() => {
    loadWallets();
  }, [accountType]);

  useEffect(() => {
    if (selectedWallet) {
      loadAnalytics();
    }
  }, [selectedWallet]);

  const loadWallets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Get all wallets for the user and account type
      const { data: allWallets, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', accountType);

      if (walletsError) throw walletsError;

      // Get the active wallet
      const { data: activeWallet, error: activeError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', accountType)
        .eq('is_active', true)
        .single();

      if (activeError && activeError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw activeError;
      }

      // Set all wallets for the dropdown
      setWallets(allWallets || []);
      
      // Set the active wallet as selected
      if (activeWallet) {
        setSelectedWallet(activeWallet.id);
      } else if (allWallets && allWallets.length > 0) {
        // If no active wallet, set the first one as active
        const firstWallet = allWallets[0];
        await supabase
          .from('wallets')
          .update({ is_active: true })
          .eq('id', firstWallet.id);
        setSelectedWallet(firstWallet.id);
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load wallets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Get transactions for the last 6 months
      const sixMonthsAgo = subMonths(new Date(), 6);
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('wallet_id', selectedWallet)
        .eq('account_type', accountType)
        .gte('transaction_date', sixMonthsAgo.toISOString())
        .order('transaction_date', { ascending: true });

      if (error) throw error;

      // Process data for analytics
      const categoryBreakdown = processCategoryBreakdown(transactions || []);
      const monthlySpending = processMonthlySpending(transactions || []);
      const totalSpent = calculateTotalSpent(transactions || []);
      const averageSpent = calculateAverageSpent(transactions || []);

      setAnalyticsData({
        categoryBreakdown,
        monthlySpending,
        totalSpent,
        averageSpent
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processCategoryBreakdown = (transactions: Transaction[]): CategoryBreakdown[] => {
    const breakdown = transactions.reduce((acc: CategoryBreakdown[], curr) => {
      const existing = acc.find(c => c.category === curr.category);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ category: curr.category, amount: curr.amount });
      }
      return acc;
    }, []);

    return breakdown.sort((a, b) => b.amount - a.amount);
  };

  const processMonthlySpending = (transactions: Transaction[]): MonthlySpending[] => {
    const monthlyData = transactions.reduce((acc: MonthlySpending[], curr) => {
      const month = format(new Date(curr.transaction_date), 'MMM yyyy');
      const existing = acc.find(m => m.month === month);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ month, amount: curr.amount });
      }
      return acc;
    }, []);

    return monthlyData.sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  };

  const calculateTotalSpent = (transactions: Transaction[]): number => {
    return transactions.reduce((sum, curr) => sum + curr.amount, 0);
  };

  const calculateAverageSpent = (transactions: Transaction[]): number => {
    if (transactions.length === 0) return 0;
    return calculateTotalSpent(transactions) / transactions.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex items-center space-x-2">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              variant={selectedWallet === wallet.id ? "default" : "outline"}
              onClick={() => setSelectedWallet(wallet.id)}
            >
              {wallet.name} (${wallet.balance.toFixed(2)})
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analyticsData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-2">
            <p>Total Spent: ${analyticsData.totalSpent.toFixed(2)}</p>
            <p>Average Transaction: ${analyticsData.averageSpent.toFixed(2)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionAnalytics; 