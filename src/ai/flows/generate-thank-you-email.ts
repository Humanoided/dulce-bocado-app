'use server';
/**
 * @fileOverview Flow for generating a thank you email after an event.
 *
 * - generateThankYouEmail - A function that generates a thank you email.
 * - GenerateThankYouEmailInput - The input type for the generateThankYouEmail function.
 * - GenerateThankYouEmailOutput - The return type for the generateThankYouEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThankYouEmailInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  eventName: z.string().describe('The name of the event.'),
  eventDate: z.string().describe('The date of the event.'),
  menuDescription: z.string().describe('The description of the menu served at the event.'),
  serviceReachDescription: z.string().describe('Description of reach of the service provided to the customer'),
});
export type GenerateThankYouEmailInput = z.infer<typeof GenerateThankYouEmailInputSchema>;

const GenerateThankYouEmailOutputSchema = z.object({
  thankYouEmail: z.string().describe('The generated thank you email content.'),
});
export type GenerateThankYouEmailOutput = z.infer<typeof GenerateThankYouEmailOutputSchema>;

export async function generateThankYouEmail(input: GenerateThankYouEmailInput): Promise<GenerateThankYouEmailOutput> {
  return generateThankYouEmailFlow(input);
}

const generateThankYouEmailPrompt = ai.definePrompt({
  name: 'generateThankYouEmailPrompt',
  input: {schema: GenerateThankYouEmailInputSchema},
  output: {schema: GenerateThankYouEmailOutputSchema},
  prompt: `You are an AI assistant specialized in generating thank you emails after events.

  Generate a personalized thank you email to the client, include event details such as the event name, date, the menu served, and description of reach of the service provided to the customer.

  Client Name: {{{clientName}}}
  Event Name: {{{eventName}}}
  Event Date: {{{eventDate}}}
  Menu Description: {{{menuDescription}}}
  Service Reach Description: {{{serviceReachDescription}}}

  Thank You Email:`, 
});

const generateThankYouEmailFlow = ai.defineFlow(
  {
    name: 'generateThankYouEmailFlow',
    inputSchema: GenerateThankYouEmailInputSchema,
    outputSchema: GenerateThankYouEmailOutputSchema,
  },
  async input => {
    const {output} = await generateThankYouEmailPrompt(input);
    return output!;
  }
);
