'use server';

/**
 * @fileOverview A flow to convert a generated menu into a set of clear instructions for the staff.
 *
 * - menuToInstructions - A function that handles the menu conversion process.
 * - MenuToInstructionsInput - The input type for the menuToInstructions function.
 * - MenuToInstructionsOutput - The return type for the menuToInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuToInstructionsInputSchema = z.object({
  menu: z.string().describe('The generated menu for the event.'),
  guestCount: z.number().describe('The number of guests attending the event.'),
  specialRequirements: z
    .string()
    .describe('Any special requirements for the event, such as dietary restrictions.'),
});
export type MenuToInstructionsInput = z.infer<typeof MenuToInstructionsInputSchema>;

const MenuToInstructionsOutputSchema = z.object({
  staffInstructions: z
    .string()
    .describe('Clear and concise instructions for the staff to prepare the menu.'),
});
export type MenuToInstructionsOutput = z.infer<typeof MenuToInstructionsOutputSchema>;

export async function menuToInstructions(input: MenuToInstructionsInput): Promise<MenuToInstructionsOutput> {
  return menuToInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'menuToInstructionsPrompt',
  input: {schema: MenuToInstructionsInputSchema},
  output: {schema: MenuToInstructionsOutputSchema},
  prompt: `You are a professional chef tasked with converting a menu into clear and actionable instructions for the kitchen staff.

Menu: {{{menu}}}
Guest Count: {{{guestCount}}}
Special Requirements: {{{specialRequirements}}}

Convert the above menu into a set of numbered instructions for the staff. These instructions should be detailed enough for any experienced chef to follow and prepare the menu efficiently. Mention any special considerations or modifications based on guest count and special requirements.

Instructions:
`,
});

const menuToInstructionsFlow = ai.defineFlow(
  {
    name: 'menuToInstructionsFlow',
    inputSchema: MenuToInstructionsInputSchema,
    outputSchema: MenuToInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
