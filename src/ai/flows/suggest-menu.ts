'use server';
/**
 * @fileOverview Menu suggestion flow.
 *
 * This file defines a Genkit flow that suggests a menu for an event based on
 * guest count and special requirements.
 *
 * @exports suggestMenu - The main function to trigger the menu suggestion flow.
 * @exports SuggestMenuInput - The input type for the suggestMenu function.
 * @exports SuggestMenuOutput - The output type for the suggestMenu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMenuInputSchema = z.object({
  guestCount: z
    .number()
    .describe('The number of guests attending the event.'),
  specialRequirements: z
    .string()
    .describe('Any special requirements for the menu, such as dietary restrictions or allergies.'),
});
export type SuggestMenuInput = z.infer<typeof SuggestMenuInputSchema>;

const SuggestMenuOutputSchema = z.object({
  menuSuggestions: z
    .string()
    .describe('Sugerencia de menú basada en los parámetros de entrada.'),
  instructionsForStaff: z
    .string()
    .describe('Instrucciones para el personal basadas en la sugerencia de menú.'),
  reachForCustomer: z
    .string()
    .describe('El alcance del servicio para el cliente basado en la sugerencia de menú.'),
});
export type SuggestMenuOutput = z.infer<typeof SuggestMenuOutputSchema>;

export async function suggestMenu(input: SuggestMenuInput): Promise<SuggestMenuOutput> {
  return suggestMenuFlow(input);
}

const suggestMenuPrompt = ai.definePrompt({
  name: 'suggestMenuPrompt',
  input: {schema: SuggestMenuInputSchema},
  output: {schema: SuggestMenuOutputSchema},
  prompt: `Eres un experto en planificar menús para eventos catering.

Se te proporcionará el número de invitados y cualquier requisito especial.

Número de Invitados: {{{guestCount}}}
Requisitos Especiales: {{{specialRequirements}}}

Basado en esta información, genera una sugerencia de menú, instrucciones para el personal basadas en la sugerencia de menú y el alcance del servicio para el cliente basado en la sugerencia de menú.

Tu salida debe contener los campos menuSuggestions, instructionsForStaff y reachForCustomer.
Salida:
{
  "menuSuggestions": "Sugerencia de menú",
  "instructionsForStaff": "Instrucciones para el personal",
  "reachForCustomer": "Alcance del servicio para el cliente"
}


`,
});

const suggestMenuFlow = ai.defineFlow(
  {
    name: 'suggestMenuFlow',
    inputSchema: SuggestMenuInputSchema,
    outputSchema: SuggestMenuOutputSchema,
  },
  async input => {
    const {output} = await suggestMenuPrompt(input);
    return output!;
  }
);
