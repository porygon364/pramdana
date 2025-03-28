import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Wallet,
  CreditCard,
  PiggyBank
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  wallet: string;
  icon: React.ReactNode;
}

const transactions: Transaction[] = [
  {
    id: '1',
    description: 'Salary',
    amount: 5000.00,
    type: 'income',
    category: 'Income',
    date: new Date('2024-03-15'),
    wallet: 'Savings',
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    id: '2',
    description: 'Grocery Shopping',
    amount: 150.00,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2024-03-14'),
    wallet: 'Credit Card',
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: '3',
    description: 'Transportation',
    amount: 25.00,
    type: 'expense',
    category: 'Transportation',
    date: new Date('2024-03-13'),
    wallet: 'Cash',
    icon: <Wallet className="h-4 w-4" />,
  },
];

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Income",
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');
  const [selectedWallet, setSelectedWallet] = React.useState('All Wallets');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || transaction.category === selectedCategory;
    const matchesWallet = selectedWallet === 'All Wallets' || transaction.wallet === selectedWallet;
    return matchesSearch && matchesCategory && matchesWallet;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedWallet} onValueChange={setSelectedWallet}>
            <SelectTrigger>
              <SelectValue placeholder="Wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Wallets">All Wallets</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Savings">Savings</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Transaction List */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {transaction.icon}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.wallet}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-medium",
                  transaction.type === 'income' ? "text-green-500" : "text-red-500"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(transaction.date, 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Transactions; 