import { NextResponse } from 'next/server';
import { FlowiseAPI } from '@/utils/flowise';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { question } = await req.json();
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

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
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 });
  }
} 