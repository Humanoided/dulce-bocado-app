import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard-header';
import { getEvents } from '@/lib/actions';
import { EventCard } from './components/event-card';
import { EventForm } from './components/event-form';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getEvents();
  
  return (
    <>
      <DashboardHeader title="Eventos" description="Gestiona todos tus eventos.">
        <EventForm>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Evento
          </Button>
        </EventForm>
      </DashboardHeader>

      {events.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No hay eventos registrados</p>
            <p className="text-sm text-muted-foreground">Crea tu primer evento para empezar.</p>
        </div>
      )}
    </>
  );
}
