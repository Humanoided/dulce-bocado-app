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
    .describe('A list of suggested menu items based on the input parameters.'),
  instructionsForStaff: z
    .string()
    .describe('Instructions for the staff based on the suggested menu.'),
  reachForCustomer: z
    .string()
    .describe('The reach of the service for the customer based on the suggested menu.'),
});
export type SuggestMenuOutput = z.infer<typeof SuggestMenuOutputSchema>;

export async function suggestMenu(input: SuggestMenuInput): Promise<SuggestMenuOutput> {
  return suggestMenuFlow(input);
}

const suggestMenuPrompt = ai.definePrompt({
  name: 'suggestMenuPrompt',
  input: {schema: SuggestMenuInputSchema},
  output: {schema: SuggestMenuOutputSchema},
  prompt: `You are an expert menu planner for catered events.

You will suggest a menu based on the number of guests and any special requirements.

Guest Count: {{{guestCount}}}
Special Requirements: {{{specialRequirements}}}

Based on this information, generate a menu suggestion, instructions for the staff based on the suggested menu and the reach of the service for the customer based on the suggested menu.

Your output must contain the menuSuggestions, instructionsForStaff, and reachForCustomer fields.
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
