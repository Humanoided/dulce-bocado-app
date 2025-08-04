import { PlusCircle, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard-header';
import { getClients } from '@/lib/actions';
import { ClientForm } from './components/client-form';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <DashboardHeader title="Clientes" description="Gestiona tu lista de clientes.">
        <ClientForm>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Cliente
          </Button>
        </ClientForm>
      </DashboardHeader>

      {clients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <Card key={client.id} className="flex flex-col shadow-md transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <User className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle>{client.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${client.email}`} className="hover:text-primary">{client.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <ClientForm client={client}>
                      <Button variant="ghost" size="sm">Editar</Button>
                  </ClientForm>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No hay clientes registrados</p>
            <p className="text-sm text-muted-foreground">Crea tu primer cliente para empezar a gestionar tus eventos.</p>
        </div>
      )}
    </>
  );
}
