
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Header from '@/components/Header';
import { AttendanceRecord } from '@/types/user';

const AttendanceHistory = () => {
  const { user } = useAuth();
  
  // Mock attendance records
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "rec1",
      eventId: "event1",
      eventName: "NSS Weekly Meeting",
      date: "2025-03-10T10:00:00Z",
      venue: "Central Auditorium",
      hours: 2,
      volunteerId: "vol1"
    },
    {
      id: "rec2",
      eventId: "event2",
      eventName: "Blood Donation Camp",
      date: "2025-03-02T09:00:00Z",
      venue: "Medical Center",
      hours: 4,
      volunteerId: "vol1"
    },
    {
      id: "rec3",
      eventId: "event3",
      eventName: "Tree Plantation Drive",
      date: "2025-02-25T08:00:00Z",
      venue: "Campus Garden",
      hours: 3,
      volunteerId: "vol1"
    },
    {
      id: "rec4",
      eventId: "event4",
      eventName: "Swachh Bharat Abhiyan",
      date: "2025-02-18T10:00:00Z",
      venue: "University Road",
      hours: 5,
      volunteerId: "vol1"
    },
    {
      id: "rec5",
      eventId: "event5",
      eventName: "Digital Literacy Workshop",
      date: "2025-02-05T14:00:00Z",
      venue: "Computer Lab",
      hours: 2,
      volunteerId: "vol1"
    }
  ]);
  
  // Calculate total hours
  const totalHours = attendanceRecords.reduce((sum, record) => sum + record.hours, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance History</h1>
          <p className="text-gray-500 mb-6">View your attendance records and total service hours</p>
          
          <div className="grid gap-6">
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
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  Your participation in NSS activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{record.eventName}</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          +{record.hours} hours
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p>Venue: {record.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceHistory;
