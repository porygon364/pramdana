
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function IllustrationHero() {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950/30 dark:to-purple-900/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-[50%] space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Smart Financial Management for Gen Z
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Track expenses, save money, and reach your financial goals with Union's powerful tools designed for the younger generation.
            </p>
            <Button className="group mt-2 flex items-center gap-2 bg-primary hover:bg-primary/90">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="mt-6 md:mt-0 flex justify-center md:justify-end">
            <img 
              src="/lovable-uploads/05ffc084-3003-4891-b8c8-7bb0c79eef7f.png" 
              alt="Person with money raining down" 
              width={300}
              height={350}
              className="h-auto max-w-full" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
