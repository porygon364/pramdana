
import { useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GoalProgress } from "@/components/GoalProgress";
import { SavingSuggestion } from "@/components/SavingSuggestion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Car, Briefcase, Globe, PlusCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const goalCategories = [
  { id: 1, name: "Home", icon: Home, color: "text-blue-500 bg-blue-100" },
  { id: 2, name: "Vehicle", icon: Car, color: "text-green-500 bg-green-100" },
  { id: 3, name: "Career", icon: Briefcase, color: "text-amber-500 bg-amber-100" },
  { id: 4, name: "Travel", icon: Globe, color: "text-purple-500 bg-purple-100" },
];

const Goals = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [date, setDate] = useState<Date>();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavigation />
      
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Financial Goals</h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="finance-gradient hover:opacity-90 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Create New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a new financial goal</DialogTitle>
                  <DialogDescription>
                    Set up a new goal to help you save for important milestones in your life.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input id="goal-name" placeholder="e.g. New Home, Vacation" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Goal Category</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {goalCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-md p-3 hover:bg-muted",
                            selectedCategory === category.id
                              ? "border-2 border-finance-primary"
                              : "border border-border"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              category.color
                            )}
                          >
                            <category.icon className="h-5 w-5" />
                          </div>
                          <span className="mt-2 text-xs font-medium">
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-amount">Target Amount ($)</Label>
                      <Input id="target-amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-date">Target Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-notes">Notes (Optional)</Label>
                    <textarea
                      id="goal-notes"
                      className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any additional details about your goal"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="finance-gradient hover:opacity-90">
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="active" className="mb-8">
            <TabsList>
              <TabsTrigger value="active">Active Goals</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <GoalProgress />
                </div>
                <div>
                  <SavingSuggestion />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No Completed Goals Yet</h3>
                  <p className="text-muted-foreground">
                    Keep working towards your financial goals!
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <GoalProgress />
                </div>
                <div>
                  <SavingSuggestion />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Goal Recommendations</CardTitle>
              <CardDescription>
                Popular financial goals you might want to consider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="finance-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Emergency Fund</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    3-6 months of expenses saved for unexpected events
                  </p>
                  <Button variant="outline" className="w-full">
                    Start This Goal
                  </Button>
                </div>
                
                <div className="finance-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <Car className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">New Vehicle</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Save for a down payment on your next vehicle
                  </p>
                  <Button variant="outline" className="w-full">
                    Start This Goal
                  </Button>
                </div>
                
                <div className="finance-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
                    <Globe className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Dream Vacation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan and save for your next adventure
                  </p>
                  <Button variant="outline" className="w-full">
                    Start This Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Goals;
