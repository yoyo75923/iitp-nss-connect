
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VolunteerDashboard from './VolunteerDashboard';
import MentorDashboard from './MentorDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Render the appropriate dashboard based on user role
  if (user?.role === 'mentor') {
    return <MentorDashboard />;
  }
  
  // Default to volunteer dashboard
  return <VolunteerDashboard />;
};

export default Dashboard;
