
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import QRCodeScanner from '@/components/QRCodeScanner';

interface AttendanceRecord {
  id: string;
  eventId: string;
  eventName: string;
  timestamp: number;
  date: string;
}

const AttendanceScan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  const handleScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      
      // Check if already scanned
      const alreadyScanned = attendanceRecords.some(
        record => record.eventId === parsedData.eventId && 
                  new Date(record.timestamp).toDateString() === new Date().toDateString()
      );
      
      if (alreadyScanned) {
        toast({
          title: "Already Scanned",
          description: "You have already marked your attendance for this event today.",
          variant: "destructive"
        });
        return;
      }
      
      // Add new attendance record
      const newRecord: AttendanceRecord = {
        id: `${parsedData.eventId}-${Date.now()}`,
        eventId: parsedData.eventId,
        eventName: parsedData.eventName,
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
      
      setAttendanceRecords(prev => [newRecord, ...prev]);
      
      toast({
        title: "Attendance Marked",
        description: `You've successfully marked your attendance for ${parsedData.eventName}`,
      });
    } catch (error) {
      console.error("Error processing QR data:", error);
      toast({
        title: "Invalid QR Code",
        description: "This QR code doesn't contain valid attendance data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Mark Attendance</h1>
          <p className="text-gray-500 mb-6">Scan the QR code from your mentor to mark your attendance</p>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Point your camera at the QR code displayed by your mentor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeScanner onScan={handleScan} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>
                  Your recently marked attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length > 0 ? (
                  <div className="space-y-2">
                    {attendanceRecords.map((record) => (
                      <div key={record.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-medium">{record.eventName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance records yet</p>
                    <p className="text-sm">Scan a QR code to mark your first attendance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceScan;
