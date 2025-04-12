
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Header from '@/components/Header';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import VolunteersList from '@/components/VolunteersList';
import { Volunteer } from '@/components/VolunteersList';
import { AttendanceRecord, User } from '@/types/user';
import Footer from '@/components/Footer';

// Sample events data - in a real app, this would come from an API or database
const SAMPLE_EVENTS = [
  { id: 'event-001', name: 'NSS Weekly Meeting' },
  { id: 'event-002', name: 'Blood Donation Camp' },
  { id: 'event-003', name: 'Tree Plantation Drive' },
  { id: 'event-004', name: 'Community Cleanup' },
  { id: 'event-005', name: 'Awareness Workshop' },
];

const AttendanceManage = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedEvent, setSelectedEvent] = useState({
    id: 'event-001',
    name: 'NSS Weekly Meeting',
  });
  
  useEffect(() => {
    // Get volunteers for the current mentor
    if (user && user.role === 'mentor' && user.volunteerObjects) {
      // Get attendance records
      const savedRecordsStr = sessionStorage.getItem('attendanceRecords');
      const savedRecords: AttendanceRecord[] = savedRecordsStr ? JSON.parse(savedRecordsStr) : [];
      
      // Map volunteer objects to volunteer list
      const volunteerList = user.volunteerObjects.map(volunteer => {
        // Get records for this volunteer
        const volunteerRecords = savedRecords.filter(
          record => record.volunteerId === volunteer.id
        );
        
        // Calculate total hours
        const totalHours = volunteerRecords.reduce(
          (sum, record) => sum + record.hours, 0
        );
        
        return {
          id: volunteer.id,
          name: volunteer.name,
          rollNumber: volunteer.rollNumber || 'N/A',
          totalHours: totalHours
        };
      });
      
      setVolunteers(volunteerList);
    }
  }, [user]);

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
                    Start attendance for an event by creating a QR code for volunteers to scan. 
                    Specify the event and hours to award.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRCodeGenerator 
                    eventId={selectedEvent.id} 
                    eventName={selectedEvent.name}
                    events={SAMPLE_EVENTS}
                  />
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
      
      <Footer />
    </div>
  );
};

export default AttendanceManage;
