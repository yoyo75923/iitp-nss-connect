
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AttendanceRecord {
  attendance_id: string;
  event: {
    title: string;
    start_time: string;
    location: string | null;
  };
  hours_attended: number;
  description: string | null;
  created_at: string;
}

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            attendance_id,
            hours_attended,
            description,
            created_at,
            event:event_id (
              title,
              start_time,
              location
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAttendance(data || []);
        
        // Calculate total hours
        const total = (data || []).reduce((sum, record) => sum + record.hours_attended, 0);
        setTotalHours(total);
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        toast.error('Failed to load attendance history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceHistory();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance History</h1>
          <p className="text-gray-500 mb-6">View your attendance records for NSS events</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Hours</CardTitle>
                <CardDescription>Hours accumulated in NSS activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-nss-primary">{totalHours}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Events Attended</CardTitle>
                <CardDescription>Number of events participated in</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-nss-primary">{attendance.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Certification Status</CardTitle>
                <CardDescription>Based on 120 hours requirement</CardDescription>
              </CardHeader>
              <CardContent>
                {totalHours >= 120 ? (
                  <p className="text-lg font-medium text-green-600">Eligible for Certificate</p>
                ) : (
                  <p className="text-lg font-medium text-amber-600">
                    Need {120 - totalHours} more hours
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Your participation in NSS events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading attendance records...</p>
              ) : attendance.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No attendance records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Event</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Hours</th>
                        <th className="py-3 px-4 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record.attendance_id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{record.event.title}</td>
                          <td className="py-3 px-4">
                            {new Date(record.event.start_time).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{record.event.location || 'N/A'}</td>
                          <td className="py-3 px-4">{record.hours_attended}</td>
                          <td className="py-3 px-4">{record.description || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttendanceHistory;
