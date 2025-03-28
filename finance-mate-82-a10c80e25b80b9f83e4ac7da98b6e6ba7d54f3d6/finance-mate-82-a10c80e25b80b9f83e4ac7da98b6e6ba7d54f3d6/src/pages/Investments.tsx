
import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PlusCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample investment data
const investmentData = [
  { date: "2023-01", value: 10000 },
  { date: "2023-02", value: 10200 },
  { date: "2023-03", value: 10150 },
  { date: "2023-04", value: 10400 },
  { date: "2023-05", value: 10700 },
  { date: "2023-06", value: 10500 },
  { date: "2023-07", value: 10800 },
  { date: "2023-08", value: 11200 },
  { date: "2023-09", value: 11100 },
  { date: "2023-10", value: 11500 },
  { date: "2023-11", value: 11700 },
  { date: "2023-12", value: 12000 },
  { date: "2024-01", value: 12400 },
  { date: "2024-02", value: 12700 },
  { date: "2024-03", value: 12800 },
  { date: "2024-04", value: 13200 },
  { date: "2024-05", value: 13500 },
  { date: "2024-06", value: 13800 },
];

const investmentPortfolio = [
  {
    name: "S&P 500 ETF",
    allocation: 40,
    value: 5520,
    change: 2.4,
    color: "bg-finance-primary",
  },
  {
    name: "Total Bond ETF",
    allocation: 30,
    value: 4140,
    change: -0.5,
    color: "bg-finance-secondary",
  },
  {
    name: "International Stocks",
    allocation: 20,
    value: 2760,
    change: 1.2,
    color: "bg-finance-accent",
  },
  {
    name: "Real Estate",
    allocation: 10,
    value: 1380,
    change: 0.8,
    color: "bg-sky-300",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 rounded-lg border shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-finance-primary font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Investments = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Investments</h1>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="finance-gradient hover:opacity-90 gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Investment
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="finance-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio</h3>
              <p className="text-2xl font-bold mt-1">$13,800.00</p>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$300 (2.2%) this month</span>
              </div>
            </div>
            <div className="finance-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Year-to-Date Return</h3>
              <p className="text-2xl font-bold mt-1">+$800.00</p>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+6.2% YTD</span>
              </div>
            </div>
            <div className="finance-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">All-Time Return</h3>
              <p className="text-2xl font-bold mt-1">+$3,800.00</p>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+38% since inception</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Performance</CardTitle>
                      <CardDescription>Historical performance of your investments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={investmentData}>
                            <defs>
                              <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                              }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tickFormatter={(value) => `$${value/1000}k`} 
                              width={60}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#0EA5E9" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#investmentGradient)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Allocation</CardTitle>
                      <CardDescription>Your current investment mix</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {investmentPortfolio.map((investment) => (
                          <div key={investment.name}>
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{investment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {investment.allocation}% of portfolio
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${investment.value.toLocaleString()}</p>
                                <div
                                  className={cn(
                                    "flex items-center text-xs",
                                    investment.change >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  )}
                                >
                                  {investment.change >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                  )}
                                  <span>
                                    {investment.change >= 0 ? "+" : ""}
                                    {investment.change}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Progress value={investment.allocation} className={investment.color} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="allocation">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Detailed Allocation Coming Soon</h3>
                  <p className="text-muted-foreground">
                    This feature is currently under development
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="performance">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Performance Analytics Coming Soon</h3>
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

export default Investments;
