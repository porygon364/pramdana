
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  amount: number;
  change: number;
  changePercentage: number;
  className?: string;
}

export function BalanceCard({
  title,
  amount,
  change,
  changePercentage,
  className,
}: BalanceCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div className={cn("finance-card p-6", className)}>
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
          <div
            className={cn(
              "flex items-center text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {change.toLocaleString()} ({isPositive ? "+" : ""}
              {changePercentage}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
