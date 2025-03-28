
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    name: "Grocery Store",
    category: "Food",
    date: "Today",
    amount: -84.32,
  },
  {
    id: 2,
    name: "Salary Deposit",
    category: "Income",
    date: "Yesterday",
    amount: 2750.0,
  },
  {
    id: 3,
    name: "Amazon",
    category: "Shopping",
    date: "Jun 14",
    amount: -42.99,
  },
  {
    id: 4,
    name: "Gas Station",
    category: "Transportation",
    date: "Jun 13",
    amount: -38.65,
  },
  {
    id: 5,
    name: "Electric Bill",
    category: "Utilities",
    date: "Jun 10",
    amount: -94.50,
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </div>
          <div className="relative w-[180px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    transaction.amount > 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-medium",
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {transaction.amount > 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
