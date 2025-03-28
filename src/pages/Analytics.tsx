import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Sample data - replace with actual data from your backend
const spendingData = [
  { category: "Food & Dining", amount: 500 },
  { category: "Transportation", amount: 300 },
  { category: "Shopping", amount: 800 },
  { category: "Bills & Utilities", amount: 1200 },
  { category: "Entertainment", amount: 400 },
  { category: "Health", amount: 200 },
  { category: "Education", amount: 600 },
  { category: "Other", amount: 300 },
];

const monthlyData = [
  { month: "Jan", income: 5000, expenses: 4000 },
  { month: "Feb", income: 5500, expenses: 4200 },
  { month: "Mar", income: 4800, expenses: 4500 },
  { month: "Apr", income: 5200, expenses: 3800 },
  { month: "May", income: 5800, expenses: 4100 },
  { month: "Jun", income: 6000, expenses: 4300 },
];

const aiInsights = [
  {
    title: "Spending Pattern Analysis",
    description: "Your food & dining expenses have increased by 15% compared to last month. Consider reviewing your dining out habits.",
    icon: <TrendingUp className="h-5 w-5 text-red-500" />,
  },
  {
    title: "Savings Opportunity",
    description: "You could save $200 monthly by reducing entertainment expenses and finding free alternatives.",
    icon: <TrendingDown className="h-5 w-5 text-green-500" />,
  },
  {
    title: "Budget Optimization",
    description: "Your transportation costs are 20% below average. Great job on optimizing your commute!",
    icon: <Sparkles className="h-5 w-5 text-blue-500" />,
  },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics & AI Insights</h1>
        <Button>
          <ArrowRight className="mr-2 h-4 w-4" />
          View Detailed Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Total Income</h3>
          </div>
          <p className="text-2xl font-bold">$32,300</p>
          <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold">$25,400</p>
          <p className="text-sm text-muted-foreground mt-1">+8% from last month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Net Savings</h3>
          </div>
          <p className="text-2xl font-bold">$6,900</p>
          <p className="text-sm text-muted-foreground mt-1">+15% from last month</p>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6">
        <h2 className="font-medium mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {insight.icon}
                <h3 className="font-medium">{insight.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spending">Spending by Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="spending" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Spending Distribution</h3>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Pie Chart Component (Replace with actual chart)
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Monthly Income vs Expenses</h3>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Bar Chart Component (Replace with actual chart)
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Spending Trends</h3>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Line Chart Component (Replace with actual chart)
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics; 