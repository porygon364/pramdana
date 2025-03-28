
import { useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ExpensesByCategoryChart } from "@/components/ExpensesByCategoryChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { UploadReceipt } from "@/components/UploadReceipt";
import { CalendarIcon, Filter, Plus, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Expenses = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Expenses</h1>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search expenses..." className="w-[200px] pl-8" />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {date ? format(date, "MMM yyyy") : "Select month"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              
              <Button className="finance-gradient hover:opacity-90 gap-1">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <RecentTransactions />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <ExpensesByCategoryChart />
                  <UploadReceipt />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="recurring">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Recurring Expenses Coming Soon</h3>
                  <p className="text-muted-foreground">
                    This feature is currently under development
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="categories">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Category Management Coming Soon</h3>
                  <p className="text-muted-foreground">
                    This feature is currently under development
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
