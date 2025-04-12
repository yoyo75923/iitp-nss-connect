
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import QRCodeScanner from '@/components/QRCodeScanner';
import { AttendanceRecord, QRCodeData } from '@/types/user';
import Footer from '@/components/Footer';

const AttendanceScan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load saved attendance records from session storage
  useEffect(() => {
    const savedRecords = sessionStorage.getItem('attendanceRecords');
    if (savedRecords && user) {
      const parsedRecords: AttendanceRecord[] = JSON.parse(savedRecords);
      // Filter records for the current user
      const userRecords = parsedRecords.filter(record => record.volunteerId === user.id);
      setAttendanceRecords(userRecords);
    }
  }, [user]);

  // Save attendance records to session storage
  const saveAttendanceRecords = (records: AttendanceRecord[]) => {
    const existingRecordsStr = sessionStorage.getItem('attendanceRecords');
    let allRecords: AttendanceRecord[] = [];
    
    if (existingRecordsStr) {
      const existingRecords: AttendanceRecord[] = JSON.parse(existingRecordsStr);
      // Remove current user's records
      const otherUsersRecords = existingRecords.filter(record => record.volunteerId !== user?.id);
      // Add updated records
      allRecords = [...otherUsersRecords, ...records];
    } else {
      allRecords = records;
    }
    
    sessionStorage.setItem('attendanceRecords', JSON.stringify(allRecords));
  };
  
  const handleScan = (data: QRCodeData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to mark attendance",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if already scanned
      const alreadyScanned = attendanceRecords.some(
        record => record.eventId === data.eventId && 
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
        id: `${data.eventId}-${Date.now()}`,
        eventId: data.eventId,
        eventName: data.eventName,
        date: new Date().toISOString(),
        venue: "NSS Event Venue",
        hours: data.hours,
        volunteerId: user.id,
        attendanceType: "present",
        timestamp: Date.now()
      };
      
      const updatedRecords = [newRecord, ...attendanceRecords];
      setAttendanceRecords(updatedRecords);
      saveAttendanceRecords(updatedRecords);
      
      // Update user's total hours in session storage
      const updatedUser = { ...user };
      updatedUser.totalHours = (updatedUser.totalHours || 0) + data.hours;
      updatedUser.eventsAttended = (updatedUser.eventsAttended || 0) + 1;
      sessionStorage.setItem('nssUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Attendance Marked",
        description: `You've successfully marked your attendance for ${data.eventName} (+${data.hours} hours)`,
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

  // Calculate total hours
  const totalHours = attendanceRecords.reduce((sum, record) => sum + record.hours, 0);

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
              <CardHeader className="pb-2">
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-nss-primary">{attendanceRecords.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-green-600">{totalHours}</p>
                  </div>
                </div>
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
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{record.eventName}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            +{record.hours} hours
                          </span>
                        </div>
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
      
      <Footer />
    </div>
  );
};

export default AttendanceScan;
