
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Camera, ImageOff, RefreshCw } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  
  // This is a mock function since we don't have actual QR code scanning logic
  // In a real app, you'd use a QR code scanning library
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Mock successful scan
      const mockQrData = JSON.stringify({
        eventId: "event123",
        eventName: "NSS Camp",
        timestamp: new Date().getTime(),
      });
      
      onScan(mockQrData);
      setIsScanning(false);
      
      toast({
        title: "QR Code Scanned",
        description: "Attendance marked successfully!",
      });
    }
  }, [onScan]);
  
  const startScanning = () => {
    setIsScanning(true);
  };
  
  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium">QR Code Scanner</h3>
          
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full md:w-auto">
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          ) : (
            <div className="w-full space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 border-2 border-white opacity-50 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-green-500"></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button onClick={handleCapture} className="bg-green-600 hover:bg-green-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture QR
                </Button>
                <Button onClick={stopScanning} variant="destructive">
                  <ImageOff className="mr-2 h-4 w-4" />
                  Stop Scanning
                </Button>
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                Position the QR code within the frame to scan
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeScanner;
