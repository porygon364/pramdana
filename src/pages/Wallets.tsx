import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Users, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface WalletCard {
  id: string;
  name: string;
  type: 'personal' | 'family' | 'business';
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
}

const wallets: WalletCard[] = [
  {
    id: 'personal',
    name: 'Personal',
    type: 'personal',
    icon: <User className="h-6 w-6" />,
    description: 'Manage your personal finances',
    isActive: true,
  },
  {
    id: 'family',
    name: 'Family & Friends',
    type: 'family',
    icon: <Users className="h-6 w-6" />,
    description: 'Track shared expenses with family and friends',
    isActive: false,
  },
  {
    id: 'business',
    name: 'Business',
    type: 'business',
    icon: <Building2 className="h-6 w-6" />,
    description: 'Manage business transactions and expenses',
    isActive: false,
  },
];

const Wallets = () => {
  const [activeWallets, setActiveWallets] = React.useState<string[]>(['personal']);
  const { toast } = useToast();

  const toggleWallet = (walletId: string) => {
    setActiveWallets(prev => {
      const newActiveWallets = prev.includes(walletId)
        ? prev.filter(id => id !== walletId)
        : [...prev, walletId];
      
      if (newActiveWallets.length === 0) {
        toast({
          title: "Warning",
          description: "You must have at least one active account type",
          variant: "destructive",
        });
        return prev;
      }

      toast({
        title: "Success",
        description: `${wallets.find(w => w.id === walletId)?.name} account ${prev.includes(walletId) ? 'deactivated' : 'activated'}`,
      });

      return newActiveWallets;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Types</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Account
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="font-medium mb-4">Active Accounts</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the account types you want to use. Each account type has its own transactions and analytics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className={cn(
                "p-6 cursor-pointer transition-colors relative",
                activeWallets.includes(wallet.id)
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleWallet(wallet.id)}
            >
              {activeWallets.includes(wallet.id) && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {wallet.icon}
                </div>
                <h3 className="font-medium">{wallet.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {wallet.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {activeWallets.includes(wallet.id) ? 'Active' : 'Inactive'}
                </span>
                <Button variant="ghost" size="sm" className="h-8">
                  Settings
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-medium mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Default Account</h3>
              <p className="text-sm text-muted-foreground">
                Select the default account for new transactions
              </p>
            </div>
            <select className="rounded-md border border-input bg-background px-3 py-2">
              {activeWallets.map(walletId => (
                <option key={walletId} value={walletId}>
                  {wallets.find(w => w.id === walletId)?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transaction Categories</h3>
              <p className="text-sm text-muted-foreground">
                Customize categories for each account type
              </p>
            </div>
            <Button variant="outline">Manage Categories</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Wallets; 