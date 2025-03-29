import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';
import { Loader2, Plus, Wallet, Users, Building2, MessageSquare } from "lucide-react";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  type: 'personal' | 'family' | 'business';
  created_at: string;
  is_active: boolean;
}

const WalletManager = () => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');

  useEffect(() => {
    loadWallets();
  }, [accountType]);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', accountType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load wallets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName || !newWalletBalance) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          name: newWalletName,
          balance: parseFloat(newWalletBalance),
          type: accountType,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wallet added successfully!",
      });

      // Reset form
      setNewWalletName('');
      setNewWalletBalance('');

      // Reload wallets
      loadWallets();
    } catch (error) {
      console.error('Error adding wallet:', error);
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = (wallet: Wallet) => {
    const message = `Wallet Details:\nName: ${wallet.name}\nBalance: $${wallet.balance.toFixed(2)}\nType: ${wallet.type}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6287784130824?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return <Wallet className="h-6 w-6" />;
      case 'family':
        return <Users className="h-6 w-6" />;
      case 'business':
        return <Building2 className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
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
      <Card className="p-6">
        <form onSubmit={handleAddWallet} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input
                id="walletName"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                placeholder="Enter wallet name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Initial Balance</Label>
              <Input
                id="initialBalance"
                type="number"
                value={newWalletBalance}
                onChange={(e) => setNewWalletBalance(e.target.value)}
                placeholder="Enter initial balance"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getWalletIcon(wallet.type)}
                <h3 className="text-lg font-semibold">{wallet.name}</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(wallet.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-3xl font-bold">${wallet.balance.toFixed(2)}</p>
          </Card>
        ))}
        {wallets.length === 0 && (
          <Card className="p-6 col-span-full">
            <p className="text-center text-muted-foreground">No wallets found</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WalletManager; 