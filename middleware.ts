import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

// Add paths that require authentication
const protectedPaths = ['/dashboard', '/community/chat']

// Add paths that should redirect to dashboard if authenticated
const authPaths = ['/auth/sign-in', '/auth/sign-up']

function isProtectedPath(path: string): boolean {
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
}

// Validate channel ID/slug format
function isValidChannelIdentifier(id: string): boolean {
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
    /^[a-z0-9-]{1,100}$/.test(id) ||
    ['general'].includes(id)
  );
}

export async function middleware(request: NextRequest) {
  // Early return for static files and images
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Handle image requests with 404
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name)
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is signed in and on an auth page, redirect to dashboard
  if (user && authPaths.some(path => pathname === path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not signed in and the path is protected, redirect to sign-in
  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if this is a chat channel request
  if (pathname.startsWith('/community/chat/')) {
    const channelId = pathname.split('/').pop();
    
    // If it's an invalid channel ID
    if (channelId && !isValidChannelIdentifier(channelId)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/community/chat/:path*',
    '/auth/:path*'
  ]
}