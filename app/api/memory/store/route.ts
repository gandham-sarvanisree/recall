import { NextRequest, NextResponse } from 'next/server';
import { hindsight } from '@/lib/hindsight';
export async function POST(req: NextRequest) {
  try {
    const { content, memoryType, contactId, context } = await req.json();
    const result = await hindsight.retainExplicit({
      content,
      type: memoryType,
      contactId,
      context,
    });
    return NextResponse.json({ success: true, memory: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
