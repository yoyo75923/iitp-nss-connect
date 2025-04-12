
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QRCodeGeneratorProps {
  eventId: string;
  eventName: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ eventId, eventName }) => {
  const [qrValue, setQrValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hours, setHours] = useState<number>(2); // Default hours
  const qrRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Generate a unique QR code value
  const generateQRValue = () => {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return JSON.stringify({
      eventId,
      eventName,
      timestamp,
      hours,
      randomStr,
    });
  };

  // Start QR code generation and auto-refresh
  const handleGenerateQR = () => {
    setIsGenerating(true);
    setQrValue(generateQRValue());
    setTimeLeft(5);
    toast({
      title: "QR Code Generated",
      description: `QR code will refresh every 5 seconds. Hours: ${hours}`
    });
  };

  // Stop QR code generation
  const handleStopQR = () => {
    setIsGenerating(false);
    toast({
      title: "QR Code Stopped",
      description: "QR code will no longer refresh"
    });
  };

  // Download QR code as image
  const handleDownloadQR = () => {
    if (qrRef.current) {
      const canvas = document.createElement("canvas");
      const svg = qrRef.current.querySelector("svg");
      
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `nss-attendance-qr-${new Date().getTime()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
          }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      }
    }
  };

  // Auto-refresh QR code every 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGenerating) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setQrValue(generateQRValue());
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating, eventId, eventName, hours]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium">QR Code for Attendance</h3>
          
          <div className="w-full">
            <div className="grid gap-3 mb-4">
              <div>
                <Label htmlFor="hours">Attendance Hours</Label>
                <Select
                  value={hours.toString()}
                  onValueChange={(value) => setHours(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="2">2 Hours</SelectItem>
                    <SelectItem value="3">3 Hours</SelectItem>
                    <SelectItem value="4">4 Hours</SelectItem>
                    <SelectItem value="5">5 Hours</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                    <SelectItem value="8">8 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {!isGenerating ? (
            <Button onClick={handleGenerateQR} className="w-full md:w-auto">
              Generate QR Code
            </Button>
          ) : (
            <div className="w-full space-y-4">
              <div 
                ref={qrRef} 
                className="bg-white p-4 rounded-lg flex items-center justify-center"
                style={{ maxWidth: isMobile ? '100%' : '300px', margin: '0 auto' }}
              >
                <QRCode
                  value={qrValue}
                  size={isMobile ? 200 : 250}
                  level="H"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button onClick={handleStopQR} variant="destructive">
                  Stop Refreshing
                </Button>
                <Button onClick={handleDownloadQR} variant="outline">
                  Download QR
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Refreshing in {timeLeft} seconds</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
