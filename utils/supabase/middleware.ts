import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

// Helper to check if route should be protected
const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard')
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string) {
          request.cookies.delete(name);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const redirectPath = request.nextUrl.searchParams.get("redirect");

  // Handle protected routes
  if (isProtectedRoute(pathname) && !user) {
    const redirectUrl = new URL("/auth/sign-in", request.url);
    if (pathname !== "/dashboard") {
      redirectUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Only redirect from sign-in/sign-up if user is already logged in
  if (user && (pathname === "/auth/sign-in" || pathname === "/auth/sign-up")) {
    const redirectTo = redirectPath || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}