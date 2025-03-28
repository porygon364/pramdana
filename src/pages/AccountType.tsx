import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Users, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AccountType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const accountTypes: AccountType[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Manage your personal finances and expenses',
    icon: <User className="h-8 w-8" />,
  },
  {
    id: 'family',
    name: 'Family & Friends',
    description: 'Track shared expenses with family and friends',
    icon: <Users className="h-8 w-8" />,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Manage business transactions and expenses',
    icon: <Building2 className="h-8 w-8" />,
  },
];

const AccountType = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select an account type",
        variant: "destructive",
      });
      return;
    }

    // Save the selected account type
    localStorage.setItem('accountType', selectedType);
    
    toast({
      title: "Success",
      description: "Account type selected successfully!",
    });

    // Navigate to dashboard
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Account Type</h1>
          <p className="text-muted-foreground">
            Select the type of account that best suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountTypes.map((type) => (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-colors ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleSelect(type.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountType; 