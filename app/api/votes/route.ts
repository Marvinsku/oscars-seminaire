import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const snapshot = await getDocs(collection(firestore, 'votes'));
  const rows: { voter: string; category: string; selections: string[] }[] = [];

  snapshot.forEach(doc => {
    const data = doc.data() as {
      voter: string;
      votes: Record<string, string[]>;
    };
    for (const [category, selections] of Object.entries(data.votes)) {
      rows.push({ voter: data.voter, category, selections });
    }
  });

  return NextResponse.json(rows);
}
