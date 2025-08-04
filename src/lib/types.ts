import type { Timestamp } from "firebase/firestore";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Event = {
  id: string;
  name:string;
  client: Client;
  date: Date;
  guests: number;
  specialRequirements?: string;
  menu?: {
    suggestions: string;
    staffInstructions: string;
    customerReach: string;
  };
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
};

export type EventDocument = Omit<Event, 'id' | 'client' | 'date'> & {
  clientId: string;
  date: Timestamp;
}
