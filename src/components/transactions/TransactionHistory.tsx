import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';
import { Loader2, Search, Filter } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  place: string;
  transaction_date: string;
  description: string;
  created_at: string;
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
  is_active: boolean;
}

const TransactionHistory = () => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  useEffect(() => {
    loadWallets();
  }, [accountType]);

  useEffect(() => {
    if (selectedWallet) {
      loadTransactions();
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

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('wallet_id', selectedWallet)
        .eq('account_type', accountType)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
          : new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getTransactionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & dining':
        return '🍽️';
      case 'transportation':
        return '🚗';
      case 'shopping':
        return '🛍️';
      case 'bills & utilities':
        return '📄';
      case 'entertainment':
        return '🎮';
      case 'health & medical':
        return '🏥';
      case 'education':
        return '📚';
      case 'travel':
        return '✈️';
      case 'gifts & donations':
        return '🎁';
      default:
        return '💰';
    }
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
        <h2 className="text-2xl font-bold">Transaction History</h2>
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={toggleSortOrder}>
            <Filter className="h-4 w-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Place</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.place}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory; 