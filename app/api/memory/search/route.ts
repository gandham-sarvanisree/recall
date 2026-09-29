import { NextRequest, NextResponse } from 'next/server';
import { hindsight } from '@/lib/hindsight';
export async function POST(req: NextRequest) {
  try {
    const { query, contactId } = await req.json();
    const memories = await hindsight.recall({
      query,
      contactId,
      limit: 10,
    });
    return NextResponse.json({ results: memories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
