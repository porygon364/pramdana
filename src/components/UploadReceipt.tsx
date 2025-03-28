
import { useState } from "react";
import { Upload, Image, FileText, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function UploadReceipt() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      // Simulate processing with AI
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Receipt processed",
          description: "Your receipt has been processed and categorized as 'Groceries'.",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Receipt Scanner
        </CardTitle>
        <CardDescription>Upload receipts for automatic expense tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
            <div className="mb-4 rounded-full bg-finance-muted p-3">
              <Upload className="h-6 w-6 text-finance-primary" />
            </div>
            <p className="mb-2 text-sm font-medium">Drag and drop or click to upload</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Supports JPG, PNG, and PDF receipts
            </p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById("receipt-upload")?.click()}
            >
              <Image className="mr-2 h-4 w-4" />
              Choose file
            </Button>
            <input
              id="receipt-upload"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-finance-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                {isProcessing || isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-finance-primary" />
                ) : (
                  <Check className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setFile(null)}
                disabled={isUploading || isProcessing}
              >
                Choose Another
              </Button>
              <Button 
                className="finance-gradient hover:opacity-90"
                onClick={handleUpload}
                disabled={isUploading || isProcessing}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Receipt"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
