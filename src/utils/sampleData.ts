
import { supabase } from '@/integrations/supabase/client';

export const addSampleEvents = async (creatorId: string) => {
  // Check if there are already events
  const { data: existingEvents } = await supabase
    .from('events')
    .select('id')
    .limit(1);
  
  if (existingEvents && existingEvents.length > 0) {
    return; // Events already exist, don't add sample data
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const events = [
    {
      title: 'NSS Weekly Meeting',
      description: 'Regular team meeting to discuss ongoing projects',
      location: 'Lecture Hall 1',
      start_time: today.toISOString(),
      end_time: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      hours: 2,
      created_by: creatorId
    },
    {
      title: 'Blood Donation Camp',
      description: 'Organized in collaboration with Red Cross',
      location: 'Student Activity Center',
      start_time: tomorrow.toISOString(),
      end_time: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours later
      hours: 5,
      created_by: creatorId
    },
    {
      title: 'Tree Plantation Drive',
      description: 'Help increase the green cover in campus',
      location: 'Campus Grounds',
      start_time: nextWeek.toISOString(),
      end_time: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      hours: 3,
      created_by: creatorId
    }
  ];
  
  await supabase.from('events').insert(events);
};
