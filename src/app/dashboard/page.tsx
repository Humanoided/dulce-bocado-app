import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, PartyPopper, CalendarCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { getEvents } from "@/lib/actions";
import { redirect } from "next/navigation";

const kpiData = [
  {
    title: "Ingresos Totales",
    value: "$45,231.89",
    icon: DollarSign,
    change: "+20.1% desde el mes pasado",
  },
  {
    title: "Clientes Activos",
    value: "12",
    icon: Users,
    change: "+2 desde el mes pasado",
  },
  {
    title: "Eventos Próximos",
    value: "4",
    icon: PartyPopper,
    change: "En los próximos 30 días",
  },
  {
    title: "Eventos Completados",
    value: "23",
    icon: CalendarCheck,
    change: "+5 este mes",
  },
];

export default async function DashboardPage() {
  const events = await getEvents();

  if (!events) {
    redirect('/login')
  }

  return (
    <>
      <DashboardHeader title="Resumen" description="Una vista rápida de tu negocio." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Eventos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <p className="font-semibold">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.client.name} - {event.date.toLocaleDateString()}</p>
                        </div>
                        <div className={`text-sm font-medium ${event.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                            {event.paymentStatus === 'Paid' ? 'Pagado' : 'Pendiente'}
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
