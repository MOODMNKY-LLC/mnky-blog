import { NextResponse } from 'next/server'
import { searchBlogPosts } from '@/lib/notion/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const posts = await searchBlogPosts(query)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json([], { status: 500 })
  }
} 