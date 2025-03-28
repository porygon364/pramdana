import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PlusCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface InvestmentData {
  date: string;
  value: number;
}

interface InvestmentChartProps {
  data: InvestmentData[];
}

function InvestmentChart({ data }: InvestmentChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value: string) => value}
          />
          <YAxis 
            tickFormatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  return: number;
  status: 'active' | 'pending' | 'sold';
}

const Investments = () => {
  const [investmentData] = useState<InvestmentData[]>([
    { date: '2023-01', value: 10000 },
    { date: '2023-02', value: 12000 },
    { date: '2023-03', value: 11500 },
    { date: '2023-04', value: 13000 },
    { date: '2023-05', value: 12500 },
    { date: '2023-06', value: 14000 },
  ]);

  const [investments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Tech Stock ETF',
      type: 'Stocks',
      amount: 5000,
      return: 12.5,
      status: 'active'
    },
    {
      id: '2',
      name: 'Real Estate Fund',
      type: 'Real Estate',
      amount: 8000,
      return: 8.2,
      status: 'active'
    },
    {
      id: '3',
      name: 'Bond Portfolio',
      type: 'Bonds',
      amount: 3000,
      return: 4.1,
      status: 'pending'
    }
  ]);

  const getStatusColor = (status: Investment['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'sold':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Investments</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Investment
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$14,000</div>
                    <p className="text-xs text-green-500">+12.5% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-blue-500">+1 new this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <ArrowDownRight className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-yellow-500">Processing</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+8.2%</div>
                    <p className="text-xs text-green-500">+2.1% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                  <CardDescription>Your investment portfolio value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvestmentChart data={investmentData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>List of your current investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investments.map((investment) => (
                      <div
                        key={investment.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <h3 className="font-medium">{investment.name}</h3>
                          <p className="text-sm text-muted-foreground">{investment.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${investment.amount.toLocaleString()}</p>
                          <p className={cn("text-sm", getStatusColor(investment.status))}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your investment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Bought Tech Stock ETF</h3>
                        <p className="text-sm text-muted-foreground">June 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">-$5,000</p>
                        <p className="text-sm text-green-500">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Sold Real Estate Fund</h3>
                        <p className="text-sm text-muted-foreground">June 10, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">+$8,000</p>
                        <p className="text-sm text-green-500">Completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Investments;
