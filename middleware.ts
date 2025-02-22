import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper to check if route should be protected
function isProtectedRoute(pathname: string): boolean {
  // Add any public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/verify-email',
    '/auth/callback',
    '/auth/check-email',
    '/auth/update-password',
    '/blog',
  ]

  // Check if the path starts with any of these prefixes
  const publicPrefixes = [
    '/_next',
    '/images',
    '/api/public',
    '/static',
    '/fonts',
  ]

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return false
  }

  // Check if it starts with a public prefix
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return false
  }

  return true
}

export async function middleware(request: NextRequest) {
  // Create a response object that we'll update based on the request
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create the Supabase client directly in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          if (request.url.startsWith('https://')) {
            options.secure = true
          }
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  try {
    const { pathname } = request.nextUrl

    // Skip session check for non-protected routes
    if (!isProtectedRoute(pathname)) {
      return response
    }

    // For protected routes, check the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return redirectToLogin(request)
    }

    if (!session) {
      return redirectToLogin(request)
    }

    // Check if session needs refresh
    const timeNow = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at
    const shouldRefresh = expiresAt && timeNow > expiresAt - 300 // Refresh 5 minutes before expiry

    if (shouldRefresh) {
      const { data: { session: newSession }, error: refreshError } = 
        await supabase.auth.refreshSession()

      // If refresh failed and token expired, redirect to login
      if (refreshError || !newSession) {
        console.warn('Session refresh failed:', refreshError)
        return redirectToLogin(request)
      }
    }

    return response
  } catch (error) {
    // Don't log auth session missing errors as they're expected
    if (!(error instanceof Error && error.message === 'Auth session missing!')) {
      console.error('Middleware error:', error)
    }
    
    // Only redirect to login for protected routes
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return redirectToLogin(request)
    }
    return response
  }
}

function redirectToLogin(request: NextRequest) {
  const redirectUrl = new URL('/auth/sign-in', request.url)
  redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}