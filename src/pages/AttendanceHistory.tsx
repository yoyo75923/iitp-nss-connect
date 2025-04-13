
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  event: {
    id: string;
    title: string;
    location: string;
    hours: number;
    start_time: string;
  };
  status: string;
  created_at: string;
}

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            id,
            status,
            created_at,
            event:event_id (
              id,
              title,
              location,
              hours,
              start_time
            )
          `)
          .eq('volunteer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setAttendanceRecords(data || []);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        toast.error('Failed to load attendance history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [user]);
  
  // Calculate total hours
  const totalHours = attendanceRecords.reduce((sum, record) => 
    sum + (record.event?.hours || 0), 0
  );

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
                {isLoading ? (
                  <p className="text-center py-4">Loading attendance records...</p>
                ) : attendanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {attendanceRecords.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{record.event?.title}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            +{record.event?.hours || 0} hours
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Date: {new Date(record.event?.start_time).toLocaleDateString()}</p>
                          <p>Venue: {record.event?.location || 'N/A'}</p>
                          <p>Status: {record.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance records yet</p>
                    <p className="text-sm">Attend events to view your history here</p>
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

export default AttendanceHistory;
