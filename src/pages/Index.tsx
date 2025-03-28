import { MainNavigation } from "@/components/MainNavigation";
import { BalanceCard } from "@/components/BalanceCard";
import { SpendingChart } from "@/components/SpendingChart";
import { ExpensesByCategoryChart } from "@/components/ExpensesByCategoryChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { GoalProgress } from "@/components/GoalProgress";
import { SavingSuggestion } from "@/components/SavingSuggestion";
import { IllustrationHero } from "@/components/IllustrationHero";
import { UploadReceipt } from "@/components/UploadReceipt";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const spendingData = [
    { category: "Housing", amount: 2000 },
    { category: "Food", amount: 800 },
    { category: "Transportation", amount: 500 },
    { category: "Entertainment", amount: 300 },
    { category: "Utilities", amount: 400 },
    { category: "Other", amount: 200 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BalanceCard
              title="Total Balance"
              amount={42580.65}
              change={1240}
              changePercentage={3.2}
            />
            <BalanceCard
              title="Monthly Spending"
              amount={3240.12}
              change={-320}
              changePercentage={-9.8}
            />
            <BalanceCard
              title="Monthly Savings"
              amount={1200.00}
              change={200}
              changePercentage={20}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SpendingChart data={spendingData} />
            <ExpensesByCategoryChart />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>
            <div className="space-y-6">
              <IllustrationHero />
              <UploadReceipt />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalProgress />
            <SavingSuggestion />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
