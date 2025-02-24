// app/api/mood-mnky/route.ts

import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Check required environment variables
if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required');
}

if (!process.env.NOTION_BLOG_DATABASE_ID) {
  throw new Error('NOTION_BLOG_DATABASE_ID is required');
}

// Initialize clients
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req: Request) {
  try {
    const { action, topic, query } = await req.json();

    switch (action) {
      case 'generate':
        return await generateBlogPost(topic);
      case 'query':
        return await queryBlogContent(query);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

async function generateBlogPost(topic: string) {
  // Retrieve relevant content from Supabase for RAG
  const { data: relevantContent } = await supabase
    .from('blog_content')
    .select('content')
    .textSearch('content', topic);

  const contextPrompt = relevantContent
    ? `Consider this relevant information: ${relevantContent.map(item => item.content).join(' ')}`
    : '';

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are MOOD MNKY, an AI assistant that generates introspective, warm, and slightly esoteric blog content. Your writing should reflect themes of self-discovery, culture, and innovation." },
      { role: "user", content: `${contextPrompt} Write a blog post about ${topic}. Include a title, an engaging introduction, main content with reflective insights, and a thought-provoking conclusion.` }
    ],
  });

  const generatedContent = completion.choices[0].message.content || 'No content generated';

  // Save to Notion
  const response = await notion.pages.create({
    parent: { database_id: process.env.NOTION_BLOG_DATABASE_ID! },
    properties: {
      Title: {
        title: [{ text: { content: topic } }],
      },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: generatedContent } }],
        },
      },
    ],
  });

  return NextResponse.json({ success: true, pageId: response.id, content: generatedContent });
}

async function queryBlogContent(query: string) {
  // Implement RAG to retrieve relevant blog content
  const { data: relevantPosts } = await supabase
    .from('blog_posts')
    .select('title, summary')
    .textSearch('content', query);

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are MOOD MNKY, an AI assistant that provides insightful responses about blog content. Your tone is reflective, warm, and slightly esoteric." },
      { role: "user", content: `Based on the query "${query}", provide a thoughtful response using this relevant information: ${JSON.stringify(relevantPosts)}` }
    ],
  });

  return NextResponse.json({ response: completion.choices[0].message.content, relevantPosts });
}