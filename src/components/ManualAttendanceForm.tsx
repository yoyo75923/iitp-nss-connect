
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema
const formSchema = z.object({
  volunteerId: z.string({
    required_error: "Please select a volunteer",
  }),
  eventId: z.string({
    required_error: "Please select an event",
  }),
  hoursAttended: z.string().transform(val => parseInt(val)),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Volunteer = {
  id: string;
  name: string;
  roll_number?: string;
};

type Event = {
  event_id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
};

const ManualAttendanceForm = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Set up form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volunteerId: "",
      eventId: "",
      hoursAttended: "1",
      description: "",
    },
  });

  // Fetch volunteers based on the user's role
  useEffect(() => {
    const fetchVolunteers = async () => {
      if (!user) return;

      try {
        let volunteerData: Volunteer[] = [];

        if (user.role === 'secretary') {
          // If secretary, get all volunteers
          const { data, error } = await supabase
            .from('users')
            .select('id, name, roll_number')
            .eq('role', 'volunteer');

          if (error) throw error;
          volunteerData = data;
        } else if (user.role === 'mentor') {
          // If mentor, get assigned volunteers
          const { data, error } = await supabase
            .from('mentor_assignments')
            .select(`
              volunteer_id,
              volunteer:volunteer_id(id, name, roll_number)
            `)
            .eq('mentor_id', user.id);

          if (error) throw error;
          volunteerData = data.map((item) => ({
            id: item.volunteer_id,
            name: item.volunteer.name,
            roll_number: item.volunteer.roll_number
          }));
        }

        setVolunteers(volunteerData);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        toast.error('Failed to load volunteers');
      }
    };

    fetchVolunteers();
  }, [user]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('event_id, title, start_time, end_time, location')
          .order('start_time', { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Insert into attendance table
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          user_id: values.volunteerId,
          event_id: values.eventId,
          hours_attended: values.hoursAttended,
          description: values.description || null
        })
        .select();

      if (error) throw error;

      // Update total_hours in mentor_assignments
      const { error: updateError } = await supabase
        .from('mentor_assignments')
        .update({ 
          total_hours: supabase.rpc('increment_hours', { 
            row_volunteer_id: values.volunteerId, 
            hours_to_add: values.hoursAttended 
          })
        })
        .eq('volunteer_id', values.volunteerId);

      if (updateError) throw updateError;
      
      toast.success('Attendance marked successfully');
      form.reset();
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      if (error.code === '23505') {
        toast.error('Attendance for this volunteer and event already exists');
      } else {
        toast.error('Failed to mark attendance');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>
          Record attendance for volunteers at NSS events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="volunteerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a volunteer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {volunteers.map((volunteer) => (
                        <SelectItem key={volunteer.id} value={volunteer.id}>
                          {volunteer.name} {volunteer.roll_number ? `(${volunteer.roll_number})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.event_id} value={event.event_id}>
                          {event.title} ({new Date(event.start_time).toLocaleDateString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoursAttended"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours Attended</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      placeholder="Enter hours"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Mark Attendance"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualAttendanceForm;
