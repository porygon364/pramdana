import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Wallet, 
  Receipt, 
  LineChart, 
  User, 
  Menu,
  X,
  Plus,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TransactionForm } from '../transactions/TransactionForm';
import { VoiceRecorder } from '../transactions/VoiceRecorder';
import { useToast } from "@/components/ui/use-toast";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = React.useState<'manual' | 'voice' | null>(null);
  const { toast } = useToast();

  const tabs = [
    { value: "wallets", label: "Wallets", icon: Wallet, path: "/dashboard/wallets" },
    { value: "transactions", label: "Transactions", icon: Receipt, path: "/dashboard/transactions" },
    { value: "analytics", label: "Analytics & AI", icon: LineChart, path: "/dashboard/analytics" },
    { value: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  const currentTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.value || "wallets";

  const handleTabChange = (value: string) => {
    const tab = tabs.find(t => t.value === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  const handleTransactionSubmit = (data: any) => {
    // Here you would typically send the data to your backend
    console.log('Transaction submitted:', data);
    toast({
      title: "Success",
      description: "Transaction recorded successfully!",
    });
    setActiveSheet(null);
  };

  const handleVoiceTranscription = (text: string) => {
    // Here you would typically parse the transcription and create a transaction
    console.log('Voice transcription:', text);
    toast({
      title: "Success",
      description: "Voice input processed successfully!",
    });
    setActiveSheet(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden border-b">
        <div className="flex items-center justify-between p-4">
          <span className="text-xl font-bold">Union</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r">
          <div className="w-full p-4">
            <span className="text-xl font-bold">Union</span>
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full mt-8">
              <TabsList className="w-full flex-col h-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full justify-start gap-2 h-12"
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative pb-16 md:pb-0">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-2">
            <Sheet open={activeSheet !== null} onOpenChange={(open) => !open && setActiveSheet(null)}>
              <SheetTrigger asChild>
                <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                  <Plus className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Transaction</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {activeSheet === 'manual' ? (
                    <TransactionForm
                      onSubmit={handleTransactionSubmit}
                      onCancel={() => setActiveSheet(null)}
                    />
                  ) : activeSheet === 'voice' ? (
                    <VoiceRecorder
                      onTranscriptionComplete={handleVoiceTranscription}
                      onCancel={() => setActiveSheet(null)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSheet('manual')}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Manual Input
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSheet('voice')}
                      >
                        <Mic className="mr-2 h-4 w-4" />
                        Voice Record
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full flex-col h-16"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardLayout; 