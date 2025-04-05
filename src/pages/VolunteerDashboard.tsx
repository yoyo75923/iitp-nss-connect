
import React from 'react';
import Header from '@/components/Header';
import EventsCarousel from '@/components/EventsCarousel';
import FeatureCard from '@/components/FeatureCard';
import { Camera, CalendarCheck, ImageIcon, MessageSquare, BookHeart, Droplets, Heart, ShoppingBag } from 'lucide-react';

const VolunteerDashboard = () => {
  const features = [
    {
      title: 'Mark Attendance',
      icon: Camera,
      path: '/attendance/scan',
      bgColor: 'bg-green-600'
    },
    {
      title: 'Attendance History',
      icon: CalendarCheck,
      path: '/attendance/history',
      bgColor: 'bg-blue-600'
    },
    {
      title: 'Gallery',
      icon: ImageIcon,
      path: '/gallery',
      bgColor: 'bg-purple-600'
    },
    {
      title: 'Chat',
      icon: MessageSquare,
      path: '/chat',
      bgColor: 'bg-indigo-600'
    },
    {
      title: 'Donation',
      icon: BookHeart,
      path: '/donation',
      bgColor: 'bg-amber-600'
    },
    {
      title: 'Blood Donation',
      icon: Droplets,
      path: '/blood-donation',
      bgColor: 'bg-red-600'
    },
    {
      title: 'Fund Raising',
      icon: Heart,
      path: '/fundraising',
      bgColor: 'bg-pink-600'
    },
    {
      title: 'Souvenir Shop',
      icon: ShoppingBag,
      path: '/shop',
      bgColor: 'bg-emerald-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pb-6">
        <EventsCarousel />
        
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                icon={feature.icon}
                path={feature.path}
                bgColor={feature.bgColor}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
