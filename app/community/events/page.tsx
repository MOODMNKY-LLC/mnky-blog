'use client';

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Users, Plus, Filter, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { EventCardSkeleton } from "@/components/community/events/EventCardSkeleton";
import Link from "next/link";

// Mock data - replace with real data from your API
const events = [
  {
    id: '1',
    title: 'Community Meetup',
    description: 'Monthly community gathering to discuss latest developments',
    date: new Date(2024, 2, 15),
    time: '18:00',
    location: 'Virtual',
    attendees: 24,
    type: 'virtual',
    category: 'meetup',
  },
  {
    id: '2',
    title: 'Tech Workshop',
    description: 'Learn about the latest features and implementations',
    date: new Date(2024, 2, 20),
    time: '14:00',
    location: 'Tech Hub, NYC',
    attendees: 45,
    type: 'in-person',
    category: 'workshop',
  },
  // Add more events...
];

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar');
  const [isLoading, setIsLoading] = useState(true);
  const [loadedEvents, setLoadedEvents] = useState(events);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadedEvents(events);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Events</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Discover and participate in community events, workshops, and meetups. Connect with fellow members in real-time gatherings.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Event Calendar
            </CardTitle>
            <CardDescription>
              Browse upcoming community events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Featured Events</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Community Workshops</li>
                <li>• Tech Talks & Presentations</li>
                <li>• Virtual Meetups</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Regular Events</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Weekly Community Hangouts</li>
                <li>• Monthly Developer Updates</li>
                <li>• Quarterly Town Halls</li>
                <li>• Annual Community Summit</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Special Events</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Hackathons & Challenges</li>
                <li>• Guest Speaker Sessions</li>
                <li>• Community Celebrations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Event Management
            </CardTitle>
            <CardDescription>
              Track and manage your event participation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Your Events</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Registered events</li>
                <li>• Past attendance</li>
                <li>• Event reminders</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Event Details</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Time and duration</li>
                <li>• Participant list</li>
                <li>• Event materials</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• RSVP to events</li>
                <li>• Add to calendar</li>
                <li>• Share events</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Begin participating in community events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Browse Events</h3>
                <p className="text-sm text-zinc-400">
                  Check out upcoming events in the calendar and find ones that interest you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Register & RSVP</h3>
                <p className="text-sm text-zinc-400">
                  Sign up for events and add them to your personal calendar.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Join & Participate</h3>
                <p className="text-sm text-zinc-400">
                  Attend events, engage with other participants, and share your experience.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/community/events/calendar" className="gap-2">
                  View Calendar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 