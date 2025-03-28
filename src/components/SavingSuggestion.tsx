
import { CircleDollarSign, TrendingUp, PiggyBank } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const suggestions = [
  {
    id: 1,
    title: "Round-Up Savings",
    description: "Round up transactions to the nearest dollar and save the difference",
    icon: CircleDollarSign,
    button: "Enable Round-Ups",
    potentialSavings: "$34/month",
  },
  {
    id: 2,
    title: "Reduce Subscriptions",
    description: "You could save by cancelling unused subscriptions",
    icon: TrendingUp,
    button: "View Subscriptions",
    potentialSavings: "$29/month",
  },
  {
    id: 3,
    title: "Automated Savings",
    description: "Set up automatic transfers to your savings account",
    icon: PiggyBank,
    button: "Set Up",
    potentialSavings: "$100/month",
  },
];

export function SavingSuggestion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saving Opportunities</CardTitle>
        <CardDescription>Personalized ways to boost your savings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <div key={suggestion.id} className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-finance-muted text-finance-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="ml-2 text-right text-sm font-medium text-green-600">
                      {suggestion.potentialSavings}
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2 w-full">
                    {suggestion.button}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
