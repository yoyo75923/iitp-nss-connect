
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
  eventId: string;
  eventName: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ eventId, eventName }) => {
  const [qrValue, setQrValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
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
      description: "QR code will refresh every 5 seconds"
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
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `nss-attendance-qr-${new Date().getTime()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error downloading QR code:', err);
          toast({
            title: "Download Failed",
            description: "Could not download QR code",
            variant: "destructive"
          });
        });
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
  }, [isGenerating, eventId, eventName]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium">QR Code for Attendance</h3>
          
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
