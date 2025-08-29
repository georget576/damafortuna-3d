import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protect both journal and profile routes
  const isProtectedRoute = pathname.startsWith("/journal") || pathname.startsWith("/profile")

  // If accessing protected route without a token, redirect to sign in
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Handle www to non-www redirects (or vice versa) for consistency
  const host = request.nextUrl.host
  if (host === 'damafortuna.org') {
    const newUrl = new URL(request.url)
    newUrl.host = 'www.damafortuna.org'
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}