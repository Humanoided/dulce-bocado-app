'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { isSameDay } from 'date-fns';
import { PartyPopper } from 'lucide-react';

type CalendarViewProps = {
  events: Event[];
};

export function CalendarView({ events }: CalendarViewProps) {
  const [date, setDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    setDate(new Date());
  }, []);

  const eventsOnSelectedDate = React.useMemo(() => {
    return date ? events.filter(event => isSameDay(event.date, date)) : [];
  }, [date, events]);
  
  const eventDates = React.useMemo(() => events.map(event => event.date), [events]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            events: eventDates,
          }}
          modifiersStyles={{
             events: {
                color: 'hsl(var(--accent-foreground))',
                backgroundColor: 'hsl(var(--accent))',
            }
          }}
        />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
                Eventos para {date ? date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' }) : '...'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] overflow-y-auto">
            {eventsOnSelectedDate.length > 0 ? (
              <ul className="space-y-2">
                {eventsOnSelectedDate.map(event => (
                  <li key={event.id} className="flex items-center gap-3 rounded-md border p-3">
                    <PartyPopper className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.client.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground pt-10">No hay eventos para esta fecha.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
