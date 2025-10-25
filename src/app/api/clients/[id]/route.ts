import { NextResponse } from 'next/server';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await deleteDoc(doc(db, 'clients', id));
    // trigger ISR revalidation for affected pages
    try {
      revalidatePath('/dashboard/clients');
      revalidatePath('/dashboard/events');
      revalidatePath('/dashboard');
    } catch (e) {
      // non-fatal if revalidation isn't available in some environments
      console.warn('revalidatePath failed', e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
