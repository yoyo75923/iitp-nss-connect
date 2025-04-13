
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VolunteerDashboard from './VolunteerDashboard';
import MentorDashboard from './MentorDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import { addSampleEvents } from '@/utils/sampleData';

const Dashboard = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // If the user is a secretary, add sample events if none exist
    if (user?.role === 'secretary') {
      addSampleEvents(user.id);
    }
  }, [user]);
  
  // Render the appropriate dashboard based on user role
  if (user?.role === 'secretary') {
    return <SecretaryDashboard />;
  }
  
  if (user?.role === 'mentor') {
    return <MentorDashboard />;
  }
  
  // Default to volunteer dashboard
  return <VolunteerDashboard />;
};

export default Dashboard;
