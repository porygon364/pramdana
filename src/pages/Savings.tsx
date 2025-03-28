
import { MainNavigation } from "@/components/MainNavigation";
import { GoalProgress } from "@/components/GoalProgress";
import { SavingSuggestion } from "@/components/SavingSuggestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";

// Sample savings data
const savingsData = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 6200 },
  { month: "Mar", amount: 7100 },
  { month: "Apr", amount: 8700 },
  { month: "May", amount: 9500 },
  { month: "Jun", amount: 11000 },
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

const SavingsAccount = () => (
  <Card>
    <CardHeader>
      <CardTitle>Savings Account</CardTitle>
      <CardDescription>Your combined savings accounts</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">$11,000.00</h3>
        <div className="flex items-center text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+$1,500 (15.8%) this month</span>
        </div>
      </div>
      
      <div className="h-[200px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value/1000}k`} 
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#0EA5E9" 
              strokeWidth={3} 
              dot={{ fill: "#0EA5E9", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-medium">Emergency Fund</p>
              <p className="text-xs text-muted-foreground">High Yield Savings</p>
            </div>
            <p className="text-sm font-medium">$5,000.00</p>
          </div>
          <Progress value={80} className="bg-finance-primary" />
        </div>
        
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-medium">House Down Payment</p>
              <p className="text-xs text-muted-foreground">Investment Account</p>
            </div>
            <p className="text-sm font-medium">$6,000.00</p>
          </div>
          <Progress value={45} className="bg-finance-secondary" />
        </div>
      </div>
      
      <Button className="mt-6 finance-gradient hover:opacity-90 gap-1 w-full">
        <Plus className="h-4 w-4" />
        Add New Savings Goal
      </Button>
    </CardContent>
  </Card>
);

const Savings = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Savings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SavingsAccount />
            </div>
            <div>
              <GoalProgress />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <SavingSuggestion />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Savings;
