
export type UserRole = 'volunteer' | 'mentor' | 'secretary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  wing?: string;
  mentor?: string;
  volunteers?: string[];
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  venue: string;
  hours: number;
  volunteerId: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  contactNumber: string;
  urgency: 'high' | 'medium' | 'low';
  postedDate: string;
}

export interface FundRaisingCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  image: string;
}

export interface SouvenirItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}
