
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import VolunteersList from '@/components/VolunteersList';
import { Volunteer } from '@/components/VolunteersList';
import Footer from '@/components/Footer';
import ManualAttendanceForm from '@/components/ManualAttendanceForm';
import { toast } from 'sonner';

const AttendanceManage = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get volunteers for the current mentor
    const fetchVolunteers = async () => {
      if (!user) return;
      
      try {
        // Get volunteers assigned to the current mentor
        const { data, error } = await supabase
          .from('mentor_assignments')
          .select(`
            volunteer_id,
            volunteer:volunteer_id(id, name, roll_number)
          `)
          .eq('mentor_id', user.id);

        if (error) {
          throw error;
        }

        if (data) {
          // Get attendance records for each volunteer
          const volunteerPromises = data.map(async (item) => {
            const volunteer = item.volunteer;
            
            const { data: attendanceData, error: attendanceError } = await supabase
              .from('attendance')
              .select(`
                event:event_id(
                  hours
                )
              `)
              .eq('volunteer_id', volunteer.id);
            
            if (attendanceError) {
              console.error('Error fetching attendance:', attendanceError);
              return {
                id: volunteer.id,
                name: volunteer.name,
                rollNumber: volunteer.roll_number,
                totalHours: 0
              };
            }
            
            // Calculate total hours
            const totalHours = (attendanceData || []).reduce(
              (sum, record) => sum + (record.event?.hours || 0), 0
            );
            
            return {
              id: volunteer.id,
              name: volunteer.name,
              rollNumber: volunteer.roll_number,
              totalHours: totalHours
            };
          });
          
          const volunteerList = await Promise.all(volunteerPromises);
          setVolunteers(volunteerList);
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        toast.error('Failed to load volunteers');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVolunteers();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
          <p className="text-gray-500 mb-6">Mark attendance and view volunteers' hours</p>
          
          <Tabs defaultValue="mark-attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mark-attendance">Mark Attendance</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mark-attendance" className="space-y-6">
              <ManualAttendanceForm />
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
                  {isLoading ? (
                    <p className="text-center py-4">Loading volunteers...</p>
                  ) : (
                    <VolunteersList volunteers={volunteers} />
                  )}
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
