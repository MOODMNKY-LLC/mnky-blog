import * as React from 'react';
import { Calendar, Clock, MapPin, Users, Settings, CalendarDays, PartyPopper, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventsRightSidebarProps {
  isCollapsed?: boolean;
}

interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  status: 'upcoming' | 'live' | 'ended';
  attendees: number;
  maxAttendees?: number;
}

interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'speaker' | 'attendee';
  status: 'going' | 'maybe' | 'invited';
}

const upcomingEvents: EventDetails[] = [
  {
    id: '1',
    title: 'Community Meetup',
    date: 'Mar 15, 2024',
    time: '18:00',
    location: 'Virtual',
    type: 'virtual',
    status: 'upcoming',
    attendees: 24,
    maxAttendees: 50,
  },
  {
    id: '2',
    title: 'Tech Workshop',
    date: 'Mar 20, 2024',
    time: '14:00',
    location: 'Tech Hub, NYC',
    type: 'in-person',
    status: 'live',
    attendees: 45,
  },
  {
    id: '3',
    title: 'Product Launch',
    date: 'Mar 25, 2024',
    time: '10:00',
    location: 'Hybrid Event',
    type: 'hybrid',
    status: 'upcoming',
    attendees: 120,
    maxAttendees: 200,
  },
];

const recentAttendees: Attendee[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    role: 'host',
    status: 'going',
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'speaker',
    status: 'going',
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'attendee',
    status: 'going',
  },
  {
    id: '4',
    name: 'Alex Johnson',
    role: 'attendee',
    status: 'maybe',
  },
];

function EventItem({ event }: { event: EventDetails }) {
  const statusColors = {
    upcoming: 'text-amber-500 bg-amber-500/10',
    live: 'text-emerald-500 bg-emerald-500/10',
    ended: 'text-zinc-500 bg-zinc-500/10',
  };

  const typeIcons = {
    virtual: <Globe className="h-3 w-3" />,
    'in-person': <MapPin className="h-3 w-3" />,
    hybrid: <Layers className="h-3 w-3" />,
  };

  return (
    <div className="flex flex-col gap-2 py-2 px-3 rounded-md bg-zinc-800/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-100">{event.title}</span>
        <Badge className={cn("text-xs", statusColors[event.status])}>
          {event.status}
        </Badge>
      </div>
      <div className="flex flex-col gap-1 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>{event.date}</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          {typeIcons[event.type]}
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3" />
          <span>
            {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attending
          </span>
        </div>
      </div>
    </div>
  );
}

function AttendeeItem({ attendee }: { attendee: Attendee }) {
  const roleColors = {
    host: 'text-amber-500 bg-amber-500/10',
    speaker: 'text-purple-500 bg-purple-500/10',
    attendee: 'text-blue-500 bg-blue-500/10',
  };

  const statusColors = {
    going: 'text-emerald-500',
    maybe: 'text-amber-500',
    invited: 'text-zinc-400',
  };

  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={attendee.avatar} />
        <AvatarFallback>{attendee.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100 truncate">
            {attendee.name}
          </span>
          <Badge className={cn("text-xs", roleColors[attendee.role])}>
            {attendee.role}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={statusColors[attendee.status]}>
            {attendee.status === 'going' ? '✓ Going' : 
             attendee.status === 'maybe' ? '? Maybe' : 
             '○ Invited'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EventsRightSidebar({ isCollapsed }: EventsRightSidebarProps) {
  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Event Details</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
        )
      }
      footerContent={
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Event Settings</span>}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Upcoming Events */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-medium text-zinc-400 uppercase">
              Upcoming Events
            </h3>
            <Badge variant="secondary" className="text-xs">
              {upcomingEvents.length} Events
            </Badge>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Recent Attendees */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-medium text-zinc-400 uppercase">
              Recent Attendees
            </h3>
            <PartyPopper className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-1">
            {recentAttendees.map(attendee => (
              <AttendeeItem key={attendee.id} attendee={attendee} />
            ))}
          </div>
        </div>
      </div>
    </BaseRightSidebar>
  );
} 