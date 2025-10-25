'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Copy, Check } from 'lucide-react';
import type { Event } from '@/lib/types';
import { generateThankYouEmail } from '@/ai/flows/generate-thank-you-email';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type EmailGeneratorProps = {
  event: Event;
};

export function EmailGenerator({ event }: EmailGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateEmail = async () => {
    setLoading(true);
    setEmailContent('');
    try {
      const result = await generateThankYouEmail({
        clientName: event.client.name,
        eventName: event.name,
        eventDate: event.date.toLocaleDateString(),
        menuDescription: event.menu?.suggestions ?? 'Menú personalizado',
        serviceReachDescription: event.menu?.customerReach ?? 'Servicio de catering completo',
      });
      setEmailContent(result.thankYouEmail);
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo generar el correo electrónico. Inténtalo de nuevo.",
      })
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    toast({ title: "Copiado", description: "Email copiado al portapapeles."});
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Email</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Generador de Email de Agradecimiento</DialogTitle>
          <DialogDescription>
            Genera un email de agradecimiento personalizado para {event.client.name} sobre el evento "{event.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!emailContent && !loading && (
             <div className="flex justify-center items-center h-48">
                <Button onClick={handleGenerateEmail}>
                    Generar Email con IA
                </Button>
            </div>
          )}
          {loading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {emailContent && (
            <div className="relative">
              <Textarea value={emailContent} readOnly rows={15} />
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        {emailContent && (
             <DialogFooter>
                <Button variant="outline" onClick={handleGenerateEmail} disabled={loading}>
                    {loading ? 'Generando...' : 'Volver a generar'}
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
