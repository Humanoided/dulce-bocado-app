'use client';

import { useState, useEffect, useRef } from 'react';
import type { Event } from '@/lib/types';
import { suggestMenu, type SuggestMenuOutput } from '@/ai/flows/suggest-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, FileDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

type MenuSuggesterProps = {
  event?: Event;
  onSuggestion: (suggestion: SuggestMenuOutput) => void;
};

export function MenuSuggester({ event, onSuggestion }: MenuSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestMenuOutput | null>(event?.menu ? { menuSuggestions: event.menu.suggestions, instructionsForStaff: event.menu.staffInstructions, reachForCustomer: event.menu.customerReach } : null);
  const [guestCount, setGuestCount] = useState(event?.guests ?? "");
  const [specialRequirements, setSpecialRequirements] = useState(event?.specialRequirements ?? '');
  const suggestionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (suggestion) {
      onSuggestion(suggestion);
    }
  }, [suggestion, onSuggestion]);

  const handleSuggestMenu = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestMenu({
        guestCount: Number(guestCount),
        specialRequirements,
      });
      setSuggestion(result);
    } catch (error) {
      console.error('Error suggesting menu:', error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo generar la sugerencia. El modelo puede estar sobrecargado. Inténtalo de nuevo más tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportToPdf = () => {
    if (suggestionRef.current) {
      html2canvas(suggestionRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('sugerencia-menu.pdf');
      });
    }
  };

  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          Asistente de Menú IA
        </CardTitle>
        <CardDescription>Genera sugerencias de menú, instrucciones y más con IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-guests">Nº Invitados</Label>
              <Input id="ai-guests" value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value))} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-requirements">Requisitos</Label>
              <Textarea id="ai-requirements" value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} />

            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSuggestMenu} disabled={loading} className="w-full">
              {loading ? 'Generando...' : 'Sugerir Menú con IA'}
            </Button>
            {suggestion && (
              <Button onClick={handleExportToPdf} variant="outline">
                <FileDown className="mr-2" />
                PDF
              </Button>
            )}
          </div>


          {suggestion && (
            <div className="mt-4 space-y-4" ref={suggestionRef}>
              <Accordion type="single" collapsible className="w-full" defaultValue='suggestions'>
                <AccordionItem value="suggestions">
                  <AccordionTrigger>Sugerencias de Menú</AccordionTrigger>
                  <AccordionContent>
                    <Textarea readOnly value={suggestion.menuSuggestions} rows={5} className="bg-background" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="instructions">
                  <AccordionTrigger>Instrucciones para el Personal</AccordionTrigger>
                  <AccordionContent>
                    <Textarea readOnly value={suggestion.instructionsForStaff} rows={5} className="bg-background" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reach">
                  <AccordionTrigger>Alcance para el Cliente</AccordionTrigger>
                  <AccordionContent>
                    <Textarea readOnly value={suggestion.reachForCustomer} rows={5} className="bg-background" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
