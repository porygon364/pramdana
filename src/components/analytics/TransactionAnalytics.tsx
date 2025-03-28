import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';
import { Loader2 } from "lucide-react";
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
  Cell,
} from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  transaction_date: string;
}

interface AnalyticsData {
  totalSpent: number;
  categoryBreakdown: { category: string; amount: number }[];
  monthlySpending: { month: string; amount: number }[];
  topCategories: { category: string; amount: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TransactionAnalytics = () => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
    
    // Listen for transaction changes
    const handleTransactionChange = () => {
      loadAnalytics();
    };
    window.addEventListener('transactionAdded', handleTransactionChange);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionChange);
    };
  }, [accountType]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('account_type', accountType)
        .order('transaction_date', { ascending: true });

      if (error) throw error;

      // Calculate analytics
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Category breakdown
      const categoryBreakdown = transactions.reduce((acc, t) => {
        const existing = acc.find(c => c.category === t.category);
        if (existing) {
          existing.amount += t.amount;
        } else {
          acc.push({ category: t.category, amount: t.amount });
        }
        return acc;
      }, [] as { category: string; amount: number }[]);

      // Monthly spending
      const monthlySpending = transactions.reduce((acc, t) => {
        const date = new Date(t.transaction_date);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        const existing = acc.find(m => m.month === month);
        if (existing) {
          existing.amount += t.amount;
        } else {
          acc.push({ month, amount: t.amount });
        }
        return acc;
      }, [] as { month: string; amount: number }[]);

      // Top categories
      const topCategories = [...categoryBreakdown]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setAnalyticsData({
        totalSpent,
        categoryBreakdown,
        monthlySpending,
        topCategories,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Total Spent</h3>
        <p className="text-3xl font-bold">${analyticsData.totalSpent.toFixed(2)}</p>
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.topCategories}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analyticsData.topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default TransactionAnalytics; 