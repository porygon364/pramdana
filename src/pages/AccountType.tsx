import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Users, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from '@/contexts/AccountContext';

interface AccountType {
  id: 'personal' | 'family' | 'business';
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const accountTypes: AccountType[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Manage your personal finances and expenses',
    icon: <User className="h-8 w-8" />,
    features: [
      'Manual expense input',
      'Receipt image analysis',
      'Voice recording for expenses',
      'Transaction history',
      'Category-based analytics'
    ]
  },
  {
    id: 'family',
    name: 'Family & Friends',
    description: 'Track shared expenses with family and friends',
    icon: <Users className="h-8 w-8" />,
    features: [
      'Add family members via WhatsApp',
      'Shared expense tracking',
      'Split bills automatically',
      'Group analytics',
      'Payment reminders'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Manage business transactions and expenses',
    icon: <Building2 className="h-8 w-8" />,
    features: [
      'Ledger management',
      'Profit & Loss statements',
      'Balance sheet tracking',
      'Asset management',
      'Business analytics'
    ]
  }
];

const AccountType = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAccountType } = useAccount();
  const [selectedType, setSelectedType] = React.useState<'personal' | 'family' | 'business' | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSelect = (typeId: 'personal' | 'family' | 'business') => {
    setSelectedType(typeId);
  };

  const handleContinue = async () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select an account type",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await setAccountType(selectedType);
      
      toast({
        title: "Success",
        description: "Account type selected successfully!",
      });

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set account type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Account Type</h1>
          <p className="text-muted-foreground">
            Select the type of account that best suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountTypes.map((type) => (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'hover:bg-muted/50 hover:shadow-md'
              }`}
              onClick={() => handleSelect(type.id)}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || loading}
            className="min-w-[200px]"
          >
            {loading ? 'Setting up account...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountType; 