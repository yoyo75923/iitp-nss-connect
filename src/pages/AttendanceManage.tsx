
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Header from '@/components/Header';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import VolunteersList from '@/components/VolunteersList';
import { Volunteer } from '@/components/VolunteersList';

const AttendanceManage = () => {
  const { user } = useAuth();
  
  // Mock event
  const event = {
    id: 'event-001',
    name: 'NSS Weekly Meeting',
  };
  
  // Mock volunteers data
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: "vol1", name: "John Doe", rollNumber: "2023CS01", totalHours: 12 },
    { id: "vol3", name: "Amit Singh", rollNumber: "2023EC05", totalHours: 8 },
    { id: "vol4", name: "Priya Sharma", rollNumber: "2023CS09", totalHours: 15 },
    { id: "vol5", name: "Rahul Kumar", rollNumber: "2023ME03", totalHours: 6 },
    { id: "vol6", name: "Neha Gupta", rollNumber: "2023EE07", totalHours: 10 },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
          <p className="text-gray-500 mb-6">Generate QR codes and view volunteers' attendance</p>
          
          <Tabs defaultValue="qr-code" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="qr-code">QR Code Generator</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="qr-code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Attendance QR Code</CardTitle>
                  <CardDescription>
                    Create a QR code for volunteers to scan and mark their attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRCodeGenerator eventId={event.id} eventName={event.name} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="volunteers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Attendance Hours</CardTitle>
                  <CardDescription>
                    View all volunteers in your wing and their total hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VolunteersList volunteers={volunteers} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AttendanceManage;
