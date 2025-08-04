'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getClients, saveEvent } from '@/lib/actions';
import type { Event, Client } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { MenuSuggester } from './menu-suggester';
import { useRouter } from 'next/navigation';

type EventFormProps = {
  children: ReactNode;
  event?: Event;
};

export function EventForm({ children, event }: EventFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(event?.date);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [menu, setMenu] = React.useState(event?.menu);

  React.useEffect(() => {
    if (event?.date) {
      setDate(new Date(event.date));
    }
    async function fetchClients() {
        const clientList = await getClients();
        setClients(clientList);
    }
    fetchClients();
  }, [event]);

  const formAction = async (formData: FormData) => {
    if(!formData.get('client')) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Debes seleccionar un cliente.',
        });
        return;
    }

    if(!date) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Debes seleccionar una fecha.',
        });
        return;
    }

    const newEvent = {
        id: event?.id,
        name: formData.get('name') as string,
        clientId: formData.get('client') as string,
        date: date,
        guests: Number(formData.get('guests')),
        specialRequirements: formData.get('specialRequirements') as string,
        paymentStatus: formData.get('paymentStatus') as Event['paymentStatus'],
        menu: menu,
    };

    try {
        await saveEvent(newEvent);
        toast({
            title: `Evento ${event ? 'actualizado' : 'creado'}`,
            description: `El evento "${newEvent.name}" ha sido ${event ? 'actualizado' : 'guardado'} con éxito.`,
        });
        router.refresh();
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo guardar el evento. Inténtalo de nuevo.',
        });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <form action={formAction}>
          <SheetHeader>
            <SheetTitle>{event ? 'Editar Evento' : 'Crear Nuevo Evento'}</SheetTitle>
            <SheetDescription>
              {event ? 'Actualiza los detalles de tu evento.' : 'Completa el formulario para crear un nuevo evento.'}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Evento</Label>
                <Input id="name" name="name" defaultValue={event?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select name="client" defaultValue={event?.client.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length > 0 ? (
                        clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))
                    ) : (
                        <SelectItem value="no-clients" disabled>No hay clientes creados</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="date">Fecha del evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Número de Invitados</Label>
                  <Input id="guests" name="guests" type="number" defaultValue={event?.guests} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Requisitos Especiales</Label>
                  <Textarea id="specialRequirements" name="specialRequirements" defaultValue={event?.specialRequirements} />
                </div>

              <MenuSuggester event={event} onSuggestion={setMenu}/>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Estado del Pago</Label>
                <Select name="paymentStatus" defaultValue={event?.paymentStatus ?? 'Pending'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pendiente</SelectItem>
                    <SelectItem value="Paid">Pagado</SelectItem>
                     <SelectItem value="Overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <SheetFooter>
            <SheetClose asChild>
                <Button type="submit">Guardar Cambios</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
