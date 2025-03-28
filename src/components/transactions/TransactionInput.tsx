import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Mic, Receipt, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';

interface TransactionInputProps {
  onSuccess?: () => void;
}

const TransactionInput = ({ onSuccess }: TransactionInputProps) => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !place) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_type,
          amount: parseFloat(amount),
          category,
          place,
          transaction_date: date.toISOString(),
          description,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });

      // Reset form
      setAmount('');
      setCategory('');
      setPlace('');
      setDescription('');
      setDate(new Date());

      onSuccess?.();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    // Here you would typically:
    // 1. Upload the receipt to storage
    // 2. Use OCR to extract transaction details
    // 3. Pre-fill the form with extracted data
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Here you would typically:
        // 1. Upload the audio file
        // 2. Use speech-to-text to extract transaction details
        // 3. Pre-fill the form with extracted data
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">
            <Plus className="h-4 w-4 mr-2" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="receipt">
            <Receipt className="h-4 w-4 mr-2" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="receipt">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Receipt className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                </p>
              </label>
            </div>
            <Button className="w-full" disabled={!receiptFile}>
              Process Receipt
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="voice">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionInput; 