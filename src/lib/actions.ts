'use server';

import { revalidatePath } from 'next/cache';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Client, Event, EventDocument } from './types';

// Client Actions
export async function getClients(): Promise<Client[]> {
  const querySnapshot = await getDocs(collection(db, 'clients'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function getClient(id: string): Promise<Client | null> {
    const docRef = doc(db, 'clients', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Client;
    } else {
        return null;
    }
}

export async function saveClient(client: Omit<Client, 'id'> & { id?: string }) {
    if (client.id) {
        const { id, ...clientData } = client;
        await updateDoc(doc(db, 'clients', id), clientData);
    } else {
        await addDoc(collection(db, 'clients'), client);
    }
    revalidatePath('/dashboard/clients');
    revalidatePath('/dashboard/events');
}


// Event Actions
export async function getEvents(): Promise<Event[]> {
  const querySnapshot = await getDocs(collection(db, 'events'));
  const events: Event[] = [];

  for (const doc of querySnapshot.docs) {
    const eventData = doc.data() as EventDocument;
    if (eventData.clientId) { // Check if clientId exists
        const client = await getClient(eventData.clientId);
        if(client) {
            events.push({
                ...eventData,
                id: doc.id,
                date: eventData.date.toDate(),
                client: client
            });
        }
    }
  }
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function saveEvent(event: Omit<Event, 'id' | 'client' | 'date'> & { id?: string, clientId: string, date?: Date }) {
  const { id, ...eventData } = event;
  
  const docData = {
    ...eventData,
    date: event.date ? Timestamp.fromDate(event.date) : Timestamp.now(),
  };

  if (id) {
    await updateDoc(doc(db, 'events', id), docData);
  } else {
    await addDoc(collection(db, 'events'), docData);
  }
  revalidatePath('/dashboard/events');
  revalidatePath('/dashboard/calendar');
  revalidatePath('/dashboard');
}
