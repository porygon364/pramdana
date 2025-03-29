import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";

const WhatsAppIntegration = () => {
  const { toast } = useToast();

  const handleWhatsAppConnect = () => {
    const message = "I want to connect my expense tracker app with WhatsApp";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6287784130824?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Connection",
      description: "Please send the message to connect your app with WhatsApp. You'll receive a confirmation message once connected.",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">WhatsApp Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your WhatsApp to sync transactions between the app and WhatsApp
            </p>
          </div>
          <Button
            onClick={handleWhatsAppConnect}
            className="bg-green-500 hover:bg-green-600"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Connect WhatsApp
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Benefits of WhatsApp Integration:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Send transactions via WhatsApp</li>
            <li>Receive transaction confirmations</li>
            <li>Sync transactions between app and WhatsApp</li>
            <li>AI-powered transaction analysis</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default WhatsAppIntegration; 