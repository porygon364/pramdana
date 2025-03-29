import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Target, 
  PiggyBank, 
  TrendingUp, 
  Award,
  Medal,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import WhatsAppIntegration from '@/components/profile/WhatsAppIntegration';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  isUnlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: "first_transaction",
    title: "First Transaction",
    description: "Record your first expense",
    icon: <Star className="h-6 w-6" />,
    points: 10,
    isUnlocked: true,
  },
  {
    id: "savings_master",
    title: "Savings Master",
    description: "Save 20% of your income for 3 months",
    icon: <PiggyBank className="h-6 w-6" />,
    points: 50,
    isUnlocked: false,
  },
  {
    id: "budget_pro",
    title: "Budget Pro",
    description: "Stay within budget for 30 days",
    icon: <Target className="h-6 w-6" />,
    points: 100,
    isUnlocked: false,
  },
  {
    id: "investment_guru",
    title: "Investment Guru",
    description: "Make your first investment",
    icon: <TrendingUp className="h-6 w-6" />,
    points: 200,
    isUnlocked: false,
  },
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(75);
  const [nextLevelXp] = React.useState(100);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <WhatsAppIntegration />
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="h-10 w-10 text-primary" />
            </div>
            <Badge className="absolute -bottom-2 -right-2 bg-primary">
              Level {level}
            </Badge>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-muted-foreground">Financial Explorer</p>
          </div>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="font-medium">Level Progress</h3>
            <span className="text-sm text-muted-foreground">
              {xp}/{nextLevelXp} XP
            </span>
          </div>
          <Progress value={(xp / nextLevelXp) * 100} className="h-2" />
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "p-4 rounded-lg border",
                achievement.isUnlocked
                  ? "bg-primary/5 border-primary"
                  : "bg-muted/50 border-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  achievement.isUnlocked
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium">
                  {achievement.points} XP
                </span>
                {achievement.isUnlocked && (
                  <Badge variant="secondary">Unlocked</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rewards */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-primary/5 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Premium Features</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Unlock advanced analytics and AI insights
            </p>
            <Button variant="outline" className="w-full">
              Unlock (500 XP)
            </Button>
          </div>
          <div className="p-4 rounded-lg border bg-primary/5 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Custom Categories</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Create your own expense categories
            </p>
            <Button variant="outline" className="w-full">
              Unlock (300 XP)
            </Button>
          </div>
          <div className="p-4 rounded-lg border bg-primary/5 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <Medal className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Export Reports</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Export your financial reports
            </p>
            <Button variant="outline" className="w-full">
              Unlock (200 XP)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile; 