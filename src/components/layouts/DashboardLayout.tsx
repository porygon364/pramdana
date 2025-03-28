import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
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

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const tabs = [
    { value: "wallets", label: "Wallets", icon: Wallet, path: "/dashboard/wallets" },
    { value: "transactions", label: "Transactions", icon: Receipt, path: "/dashboard/transactions" },
    { value: "analytics", label: "Analytics & AI", icon: LineChart, path: "/dashboard/analytics" },
    { value: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  const currentTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.value || "wallets";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <span className="text-xl font-bold">Union</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 z-50 bg-background md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}>
          <div className="p-4">
            <TabsList className="w-full flex-col h-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r">
          <div className="w-full p-4">
            <span className="text-xl font-bold">Union</span>
            <TabsList className="w-full flex-col h-auto mt-8">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-2">
            <Sheet>
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
                  {/* Manual Input Form */}
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="mr-2 h-4 w-4" />
                      Manual Input
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Record
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 