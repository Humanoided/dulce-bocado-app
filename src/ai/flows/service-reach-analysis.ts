'use server';

/**
 * @fileOverview Analyzes the service reach for a customer based on the event details.
 *
 * - analyzeServiceReach - A function that analyzes the service reach for a customer.
 * - AnalyzeServiceReachInput - The input type for the analyzeServiceReach function.
 * - AnalyzeServiceReachOutput - The return type for the analyzeServiceReach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeServiceReachInputSchema = z.object({
  eventLocation: z.string().describe('The location of the event.'),
  eventDate: z.string().describe('The date of the event.'),
  customerRequirements: z.string().describe('Any specific requirements from the customer.'),
});
export type AnalyzeServiceReachInput = z.infer<typeof AnalyzeServiceReachInputSchema>;

const AnalyzeServiceReachOutputSchema = z.object({
  servicePlan: z.string().describe('The recommended service plan for the event.'),
  staffInstructions: z.string().describe('Instructions for the staff based on the menu and event details.'),
  customerSummary: z.string().describe('A summary of the service reach for the customer.'),
});
export type AnalyzeServiceReachOutput = z.infer<typeof AnalyzeServiceReachOutputSchema>;

export async function analyzeServiceReach(input: AnalyzeServiceReachInput): Promise<AnalyzeServiceReachOutput> {
  return analyzeServiceReachFlow(input);
}

const analyzeServiceReachPrompt = ai.definePrompt({
  name: 'analyzeServiceReachPrompt',
  input: {schema: AnalyzeServiceReachInputSchema},
  output: {schema: AnalyzeServiceReachOutputSchema},
  prompt: `You are an expert event planner. Analyze the service reach for a customer based on the event location, date, and customer requirements.

Event Location: {{{eventLocation}}}
Event Date: {{{eventDate}}}
Customer Requirements: {{{customerRequirements}}}

Based on this information, provide the best service plan for their event, instructions for the staff, and a summary for the customer.

Service Plan: A detailed plan outlining the services to be provided.
Staff Instructions: Clear instructions for the staff based on the menu and event details.
Customer Summary: A summary of the service reach, highlighting key aspects for the customer.`, // Ensure Handlebars syntax is correctly used
});

const analyzeServiceReachFlow = ai.defineFlow(
  {
    name: 'analyzeServiceReachFlow',
    inputSchema: AnalyzeServiceReachInputSchema,
    outputSchema: AnalyzeServiceReachOutputSchema,
  },
  async input => {
    const {output} = await analyzeServiceReachPrompt(input);
    return output!;
  }
);
