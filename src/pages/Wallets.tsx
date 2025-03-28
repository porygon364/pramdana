import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCard {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'card' | 'savings';
  icon: React.ReactNode;
}

const wallets: WalletCard[] = [
  {
    id: 'cash',
    name: 'Cash',
    balance: 500.00,
    type: 'cash',
    icon: <Wallet className="h-6 w-6" />,
  },
  {
    id: 'card',
    name: 'Credit Card',
    balance: 2500.00,
    type: 'card',
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    id: 'savings',
    name: 'Savings',
    balance: 10000.00,
    type: 'savings',
    icon: <PiggyBank className="h-6 w-6" />,
  },
];

const Wallets = () => {
  const [activeWallet, setActiveWallet] = React.useState<string>('cash');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card
            key={wallet.id}
            className={cn(
              "p-6 cursor-pointer transition-colors",
              activeWallet === wallet.id
                ? "bg-primary/5 border-primary"
                : "hover:bg-muted/50"
            )}
            onClick={() => setActiveWallet(wallet.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {wallet.icon}
              </div>
              <h3 className="font-medium">{wallet.name}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">
                ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="font-medium mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {/* Sample transactions - replace with actual data */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Grocery Shopping</p>
                <p className="text-sm text-muted-foreground">Cash</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-500">-$50.00</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Online Purchase</p>
                <p className="text-sm text-muted-foreground">Credit Card</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-500">-$120.00</p>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Wallets; 