import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { assistantName, systemPrompt, temperature } = body;

    // Make request to Flowise API to update configuration
    const response = await fetch(`${process.env.FLOWISE_API_URL}/chatflow/override`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLOWISE_API_KEY}`,
      },
      body: JSON.stringify({
        chatflowid: process.env.FLOWISE_CHATFLOW_ID, // You'll need to add this to your .env
        overrideConfig: {
          assistantName,
          systemPrompt,
          temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update Flowise configuration');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating Flowise config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 