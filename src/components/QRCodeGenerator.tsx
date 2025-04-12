
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { RefreshCw, Check, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface QRCodeGeneratorProps {
  eventId: string;
  eventName: string;
  events?: Array<{id: string, name: string}>;
}

const formSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  eventName: z.string().min(1, "Event name is required"),
  hours: z.string().min(1, "Hours are required"),
});

type FormValues = z.infer<typeof formSchema>;

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ eventId: defaultEventId, eventName: defaultEventName, events = [] }) => {
  const [qrValue, setQrValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [activeEvent, setActiveEvent] = useState<{id: string, name: string} | null>(null);
  const [hours, setHours] = useState<number>(2); // Default hours
  const qrRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: defaultEventId,
      eventName: defaultEventName,
      hours: "2",
    },
  });

  // Generate a unique QR code value
  const generateQRValue = () => {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const eventToUse = activeEvent || { id: defaultEventId, name: defaultEventName };
    
    return JSON.stringify({
      eventId: eventToUse.id,
      eventName: eventToUse.name,
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
      title: "Attendance Started",
      description: `QR code will refresh every 5 seconds. Event: ${activeEvent?.name || defaultEventName}, Hours: ${hours}`
    });
  };

  // Start attendance with a new event
  const handleSubmitNewEvent = (values: FormValues) => {
    const selectedEventId = values.eventId;
    let selectedEventName = values.eventName;
    
    // If we have predefined events and user selected one, use its name
    if (events.length > 0) {
      const matchedEvent = events.find(e => e.id === selectedEventId);
      if (matchedEvent) {
        selectedEventName = matchedEvent.name;
      }
    }
    
    setActiveEvent({
      id: selectedEventId,
      name: selectedEventName
    });
    setHours(parseInt(values.hours));
    
    // Start generating QR code
    setIsGenerating(true);
    setQrValue(generateQRValue());
    setTimeLeft(5);
    
    toast({
      title: "New Attendance Started",
      description: `QR code will refresh every 5 seconds. Event: ${selectedEventName}, Hours: ${values.hours}`
    });
  };

  // Stop QR code generation
  const handleStopQR = () => {
    setIsGenerating(false);
    setActiveEvent(null);
    toast({
      title: "Attendance Closed",
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
  }, [isGenerating, activeEvent, hours]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium">QR Code for Attendance</h3>
          
          {!isGenerating ? (
            <div className="w-full space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitNewEvent)} className="space-y-4 w-full">
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attendance Hours</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Attendance
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold">Active Attendance</h4>
                <p className="text-green-700">
                  Event: {activeEvent?.name || defaultEventName} | {hours} Hours
                </p>
              </div>
              
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
                  <Check className="mr-2 h-4 w-4" />
                  Close Attendance
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
