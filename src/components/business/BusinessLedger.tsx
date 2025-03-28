import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Building2, DollarSign, Scale } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

interface Asset {
  id: string;
  type: 'current' | 'fixed';
  name: string;
  value: number;
  description?: string;
}

interface Liability {
  id: string;
  type: 'debt' | 'long_term';
  name: string;
  amount: number;
  description?: string;
}

const BusinessLedger = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({});
  const [newLiability, setNewLiability] = useState<Partial<Liability>>({});

  useEffect(() => {
    loadAssets();
    loadLiabilities();
  }, []);

  const loadAssets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('business_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets",
        variant: "destructive",
      });
    }
  };

  const loadLiabilities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('business_liabilities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLiabilities(data || []);
    } catch (error) {
      console.error('Error loading liabilities:', error);
      toast({
        title: "Error",
        description: "Failed to load liabilities",
        variant: "destructive",
      });
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.value || !newAsset.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('business_assets')
        .insert({
          user_id: user.id,
          ...newAsset,
          value: parseFloat(newAsset.value as any),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset added successfully!",
      });

      setNewAsset({});
      loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLiability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiability.name || !newLiability.amount || !newLiability.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('business_liabilities')
        .insert({
          user_id: user.id,
          ...newLiability,
          amount: parseFloat(newLiability.amount as any),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Liability added successfully!",
      });

      setNewLiability({});
      loadLiabilities();
    } catch (error) {
      console.error('Error adding liability:', error);
      toast({
        title: "Error",
        description: "Failed to add liability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  };

  const calculateTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  };

  const calculateEquity = () => {
    return calculateTotalAssets() - calculateTotalLiabilities();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Total Assets</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              ${calculateTotalAssets().toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <h3 className="text-sm font-medium text-red-700 dark:text-red-300">Total Liabilities</h3>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              ${calculateTotalLiabilities().toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Equity</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              ${calculateEquity().toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assets">
            <Building2 className="h-4 w-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            <Scale className="h-4 w-4 mr-2" />
            Liabilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-name">Name</Label>
                  <Input
                    id="asset-name"
                    value={newAsset.name || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-type">Type</Label>
                  <select
                    id="asset-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newAsset.type || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as 'current' | 'fixed' })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="current">Current Asset</option>
                    <option value="fixed">Fixed Asset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-value">Value</Label>
                  <Input
                    id="asset-value"
                    type="number"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-description">Description</Label>
                  <Input
                    id="asset-description"
                    value={newAsset.description || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Assets List</h3>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {asset.type === 'current' ? 'Current Asset' : 'Fixed Asset'} - ${asset.value.toLocaleString()}
                      </p>
                      {asset.description && (
                        <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        // Handle delete asset
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {assets.length === 0 && (
                  <p className="text-center text-muted-foreground">No assets added yet</p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="liabilities">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add Liability</h2>
            <form onSubmit={handleAddLiability} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liability-name">Name</Label>
                  <Input
                    id="liability-name"
                    value={newLiability.name || ''}
                    onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-type">Type</Label>
                  <select
                    id="liability-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newLiability.type || ''}
                    onChange={(e) => setNewLiability({ ...newLiability, type: e.target.value as 'debt' | 'long_term' })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="debt">Debt</option>
                    <option value="long_term">Long-term Financing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liability-amount">Amount</Label>
                  <Input
                    id="liability-amount"
                    type="number"
                    value={newLiability.amount || ''}
                    onChange={(e) => setNewLiability({ ...newLiability, amount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-description">Description</Label>
                  <Input
                    id="liability-description"
                    value={newLiability.description || ''}
                    onChange={(e) => setNewLiability({ ...newLiability, description: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Liability
              </Button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Liabilities List</h3>
              <div className="space-y-4">
                {liabilities.map((liability) => (
                  <div
                    key={liability.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{liability.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {liability.type === 'debt' ? 'Debt' : 'Long-term Financing'} - ${liability.amount.toLocaleString()}
                      </p>
                      {liability.description && (
                        <p className="text-sm text-muted-foreground mt-1">{liability.description}</p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        // Handle delete liability
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {liabilities.length === 0 && (
                  <p className="text-center text-muted-foreground">No liabilities added yet</p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessLedger; 