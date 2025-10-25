import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, Edit } from 'lucide-react';
import type { Event } from '@/lib/types';
import { EventForm } from './event-form';
import { EmailGenerator } from './email-generator';
import { DeleteEventButton } from './delete-event-button';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const getBadgeVariant = (status: Event['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  const statusInSpanish = {
    'Paid': 'Pagado',
    'Pending': 'Pendiente',
    'Overdue': 'Vencido'
  }

  return (
    <Card className="flex flex-col shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-headline text-xl">{event.name}</CardTitle>
            <CardDescription>{event.client.name}</CardDescription>
          </div>
          <Badge variant={getBadgeVariant(event.paymentStatus)} className={`${event.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : ''}`}>
            {statusInSpanish[event.paymentStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{event.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{event.guests} invitados</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-2">
       <EmailGenerator event={event} />
        <EventForm event={event}>
        <Button variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Editar</span>
        </Button>
      </EventForm>
      <DeleteEventButton eventId={event.id} eventName={event.name} />
    </CardFooter>
    </Card>
  );
}
