
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

interface Volunteer {
  id: string;
  name: string;
  roll_number: string;
  isPresent?: boolean;
}

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  hours: number;
}

const ManualAttendanceForm = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch assigned volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      if (!user) return;
      
      setIsLoading(true);
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
          const formattedVolunteers = data.map(item => ({
            id: item.volunteer.id,
            name: item.volunteer.name,
            roll_number: item.volunteer.roll_number,
            isPresent: false
          }));
          
          setVolunteers(formattedVolunteers);
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

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('end_time', now)
          .order('start_time', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  const handleCheckboxChange = (volunteerId: string, isChecked: boolean) => {
    setVolunteers(volunteers.map(vol => 
      vol.id === volunteerId ? { ...vol, isPresent: isChecked } : vol
    ));
  };

  const handleSubmit = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    const presentVolunteers = volunteers.filter(vol => vol.isPresent);
    
    if (presentVolunteers.length === 0) {
      toast.error('No volunteers marked as present');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare attendance records
      const attendanceRecords = presentVolunteers.map(vol => ({
        event_id: selectedEvent,
        volunteer_id: vol.id,
        marked_by: user?.id,
        status: 'present'
      }));

      // Insert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, { 
          onConflict: 'event_id,volunteer_id',
          ignoreDuplicates: false
        });

      if (error) {
        throw error;
      }

      toast.success('Attendance marked successfully');
      
      // Reset form
      setVolunteers(volunteers.map(vol => ({ ...vol, isPresent: false })));
      setSelectedEvent(null);
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>
          Select an event and mark attendance for your assigned volunteers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event">Select Event</Label>
            <Select
              value={selectedEvent || undefined}
              onValueChange={setSelectedEvent}
            >
              <SelectTrigger id="event">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} ({new Date(event.start_time).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Volunteers</h3>
            
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading volunteers...</p>
            ) : volunteers.length > 0 ? (
              <div className="border rounded-md divide-y">
                {volunteers.map(volunteer => (
                  <div key={volunteer.id} className="flex items-center p-3">
                    <Checkbox
                      id={`volunteer-${volunteer.id}`}
                      checked={volunteer.isPresent || false}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(volunteer.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`volunteer-${volunteer.id}`}
                      className="ml-3 flex-1 text-sm cursor-pointer"
                    >
                      <span className="font-medium">{volunteer.name}</span>
                      <span className="text-gray-500 ml-2">({volunteer.roll_number})</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No volunteers assigned to you</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedEvent || isSaving}
        >
          {isSaving ? 'Saving...' : 'Mark Attendance'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManualAttendanceForm;
