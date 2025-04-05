
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from 'lucide-react';

// Mock events data
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Campus Cleaning Drive',
    date: '2025-04-20',
    time: '09:00 AM - 12:00 PM',
    location: 'Main Campus',
    image: '/placeholder.svg',
    description: 'Join us for a campus-wide cleaning initiative to maintain our beautiful campus.'
  },
  {
    id: 2,
    title: 'Blood Donation Camp',
    date: '2025-04-25',
    time: '10:00 AM - 04:00 PM',
    location: 'Medical Center',
    image: '/placeholder.svg',
    description: 'Donate blood and save lives. Refreshments will be provided to all donors.'
  },
  {
    id: 3,
    title: 'Tree Plantation Drive',
    date: '2025-05-05',
    time: '08:00 AM - 11:00 AM',
    location: 'Campus Garden',
    image: '/placeholder.svg',
    description: 'Let\'s make our campus greener by planting more trees.'
  },
  {
    id: 4,
    title: 'Career Guidance Workshop',
    date: '2025-05-10',
    time: '02:00 PM - 04:00 PM',
    location: 'Lecture Hall 1',
    image: '/placeholder.svg',
    description: 'Career guidance workshop for high school students from nearby villages.'
  }
];

const EventsCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [events] = useState(MOCK_EVENTS);

  useEffect(() => {
    if (!api) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [api]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update current slide index when the API provides it
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
      <Carousel
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id}>
              <Card className="border-none shadow-md">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-lg flex flex-col justify-end p-4">
                      <h3 className="text-white text-xl font-bold">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {events.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  current === index ? "bg-nss-primary w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default EventsCarousel;
