import { NextRequest, NextResponse } from 'next/server';
import { hindsight } from '@/lib/hindsight';
export async function POST(req: NextRequest) {
  try {
    const { transcriptChunk, contactId } = await req.json();
    const classified = await hindsight.retain({
      text: transcriptChunk,
      contactId,
      autoClassify: true,
    });
    return NextResponse.json({ memories: classified });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
