import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Helper to check if route should be protected
function isProtectedRoute(pathname: string): boolean {
  // Add any public routes that don't need authentication
  const publicRoutes = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/auth/callback",
    "/auth/check-email",
    "/auth/update-password",
    "/blog",
  ];

  // Check if the path starts with any of these prefixes
  const publicPrefixes = [
    "/_next",
    "/images",
    "/api/public",
    "/static",
    "/fonts",
  ];

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return false;
  }

  // Check if it starts with a public prefix
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return false;
  }

  return true;
}

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
              secure: process.env.NODE_ENV === "production",
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    const { pathname } = request.nextUrl;
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Handle protected routes
    if (isProtectedRoute(pathname) && userError) {
      const redirectUrl = new URL("/auth/sign-in", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect logged-in users from auth pages to dashboard
    if (!userError && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (error) {
    // Log unexpected errors
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error("Middleware error:", error);
    }
    return response;
  }
};