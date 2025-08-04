'use client';

import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Client } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { saveClient } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type ClientFormProps = {
  children: ReactNode;
  client?: Client;
};

export function ClientForm({ children, client }: ClientFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    const newClient = {
        id: client?.id,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
    };
    
    try {
        await saveClient(newClient);
        toast({
            title: `Cliente ${client ? 'actualizado' : 'creado'}`,
            description: `El cliente "${newClient.name}" ha sido ${client ? 'actualizado' : 'guardado'} con éxito.`,
        });
        router.refresh();
    } catch(error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo guardar el cliente. Inténtalo de nuevo.',
        });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <form action={formAction}>
            <SheetHeader>
            <SheetTitle>{client ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</SheetTitle>
            <SheetDescription>
                {client ? 'Actualiza los detalles de tu cliente.' : 'Añade un nuevo cliente a tu lista.'}
            </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Nombre
                </Label>
                <Input id="name" name="name" defaultValue={client?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                Email
                </Label>
                <Input id="email" name="email" type="email" defaultValue={client?.email} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                Teléfono
                </Label>
                <Input id="phone" name="phone" defaultValue={client?.phone} className="col-span-3" required />
            </div>
            </div>
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
