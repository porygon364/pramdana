
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const goals = [
  {
    id: 1,
    name: "House Down Payment",
    target: 50000,
    current: 32500,
    date: "Dec 2024",
    color: "bg-finance-primary",
  },
  {
    id: 2,
    name: "New Car",
    target: 25000,
    current: 8750,
    date: "Aug 2025",
    color: "bg-finance-secondary",
  },
  {
    id: 3,
    name: "Emergency Fund",
    target: 15000,
    current: 12000,
    date: "Oct 2023",
    color: "bg-finance-accent",
  },
];

export function GoalProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
        <CardDescription>Your progress towards your targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progressPercent = Math.round((goal.current / goal.target) * 100);
            
            return (
              <div key={goal.id}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">Target date: {goal.date}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Progress value={progressPercent} className={goal.color} />
                  <p className="text-right text-xs text-muted-foreground">{progressPercent}% Complete</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
