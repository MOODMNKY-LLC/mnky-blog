import { NextResponse } from 'next/server';
import { FlowiseAPI } from '@/utils/flowise';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    const response = await fetch(`${FlowiseAPI.CHAT_CONFIG.baseUrl}/api/v1/prediction/${FlowiseAPI.CHAT_CONFIG.chatflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FlowiseAPI.CHAT_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        question,
        streaming: true
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create stream' }, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 });
  }
} 