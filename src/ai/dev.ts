import { config } from 'dotenv';
config();

import '@/ai/flows/menu-to-instructions.ts';
import '@/ai/flows/service-reach-analysis.ts';
import '@/ai/flows/suggest-menu.ts';
import '@/ai/flows/generate-thank-you-email.ts';