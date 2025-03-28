import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, User, Building2, ChevronRight } from "lucide-react";

const AccountType = () => {
  const navigate = useNavigate();

  const accountTypes = [
    {
      title: "Personal",
      description: "Perfect for managing your personal finances",
      icon: User,
      color: "from-blue-500 to-blue-700",
      features: [
        "Personal expense tracking",
        "Individual savings goals",
        "Personal financial insights"
      ]
    },
    {
      title: "Family & Friends",
      description: "Share and manage finances with your loved ones",
      icon: Users,
      color: "from-purple-500 to-purple-700",
      features: [
        "Shared expense tracking",
        "Group savings goals",
        "Family financial insights",
        "Split bills easily"
      ]
    },
    {
      title: "Business",
      description: "Professional financial management for your business",
      icon: Building2,
      color: "from-green-500 to-green-700",
      features: [
        "Business expense tracking",
        "Team financial management",
        "Business analytics",
        "Invoice management"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Account Type</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the type of account that best fits your needs. You can always change this later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {accountTypes.map((type) => (
            <Card
              key={type.title}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/dashboard/${type.title.toLowerCase()}`)}
            >
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{type.description}</p>
                <ul className="space-y-2 mb-6">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full group-hover:translate-x-2 transition-transform">
                  Select {type.title}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountType; 