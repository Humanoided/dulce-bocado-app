import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarView } from './components/calendar-view';
import { getEvents } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const events = await getEvents();
  return (
    <>
      <DashboardHeader
        title="Calendario de Eventos"
        description="Visualiza todos tus eventos programados."
      />
      <Card className="shadow-md">
        <CardContent className="p-2 md:p-6">
          <CalendarView events={events} />
        </CardContent>
      </Card>
    </>
  );
}
