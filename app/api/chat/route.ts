import { NextRequest, NextResponse } from 'next/server';
import { hindsight } from '@/lib/hindsight';
export async function POST(req: NextRequest) {
  try {
    const { message, contactId } = await req.json();
    const recalledMemories = await hindsight.recall({
      query: message,
      contactId,
      limit: 5,
    });
    const contextText = recalledMemories.map((m: any) => m.content).join('\n');
    const systemPrompt = `You are Recall AI. Answer using these memories:\n${contextText}`;
    const reply = `Based on prior context: System retrieved ${recalledMemories.length} relevant memories. Response synthesized.`;
    return NextResponse.json({ reply, memoriesUsed: recalledMemories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
