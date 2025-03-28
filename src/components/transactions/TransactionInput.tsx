import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Mic, Receipt, Plus, Loader2, Upload, Record } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/contexts/AccountContext';
import { analyzeReceipt, transcribeAudio, extractTransactionDetails } from '@/lib/openai';

interface TransactionInputProps {
  onSuccess?: () => void;
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health & Medical',
  'Education',
  'Travel',
  'Gifts & Donations',
  'Other'
];

const TransactionInput = ({ onSuccess }: TransactionInputProps) => {
  const { toast } = useToast();
  const { accountType } = useAccount();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    loadWallets();
  }, [accountType]);

  const loadWallets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', accountType)
        .eq('is_active', true);

      if (error) throw error;
      setWallets(data || []);
      
      // Set first wallet as default if available
      if (data && data.length > 0) {
        setSelectedWallet(data[0].id);
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load wallets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !place || !selectedWallet) {
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

      // Start a transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_id: selectedWallet,
          amount: parseFloat(amount),
          category,
          place,
          transaction_date: date.toISOString(),
          description,
          account_type: accountType,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update wallet balance
      const { error: walletError } = await supabase.rpc('update_wallet_balance', {
        p_wallet_id: selectedWallet,
        p_amount: parseFloat(amount)
      });

      if (walletError) throw walletError;

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

      // Reload wallets to update balances
      loadWallets();

      onSuccess?.();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processReceipt = async () => {
    if (!receiptFile) return;

    try {
      setProcessing(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          const base64Data = base64String.split(',')[1];
          
          const result = await analyzeReceipt(base64Data);
          
          // Pre-fill the form with extracted data
          setAmount(result.amount.toString());
          setPlace(result.place);
          setDate(new Date(result.date));
          setDescription(`Items: ${result.items.join(', ')}`);
          
          toast({
            title: "Success",
            description: "Receipt processed successfully!",
          });
        } catch (error) {
          console.error('Error processing receipt:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process receipt. Please try again.",
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the receipt file. Please try again.",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(receiptFile);
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
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
        try {
          setProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const transcribedText = await transcribeAudio(audioBlob);
          const result = await extractTransactionDetails(transcribedText);
          
          // Pre-fill the form with extracted data
          setAmount(result.amount.toString());
          setCategory(result.category);
          setPlace(result.place);
          setDate(new Date(result.date));
          setDescription(result.description);
          
          toast({
            title: "Success",
            description: "Voice input processed successfully!",
          });
        } catch (error) {
          console.error('Error processing voice input:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process voice input. Please try again.",
            variant: "destructive",
          });
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to access microphone. Please check permissions.",
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
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} (${wallet.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Enter place"
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
                placeholder="Enter description"
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
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt-upload"
                disabled={processing}
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                </p>
              </label>
            </div>
            <Button 
              className="w-full" 
              disabled={!receiptFile || processing}
              onClick={processReceipt}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Process Receipt
                </>
              )}
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
                disabled={processing}
              >
                {processing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Record className="h-6 w-6" />
                )}
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