import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

// Add paths that require authentication
const protectedPaths = ['/dashboard']

// Add paths that should redirect to dashboard if authenticated
const authPaths = ['/auth/sign-in', '/auth/sign-up']

function isProtectedPath(path: string): boolean {
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
}

export async function middleware(request: NextRequest) {
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
        remove(name: string) {
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
  if (user && authPaths.some(path => request.nextUrl.pathname === path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not signed in and the path is protected, redirect to sign-in
  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match only the following paths:
     * - /dashboard/** (dashboard routes)
     * - /auth/sign-in
     * - /auth/sign-up
     */
    '/dashboard/:path*',
    '/auth/sign-in',
    '/auth/sign-up',
  ],
}