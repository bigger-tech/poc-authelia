import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('Remote-User')
  const authGroups = request.headers.get('Remote-Groups')

  // Si no hay usuario autenticado y no estamos en la página de login
  if (!authHeader && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect('http://localhost:9091')
  }

  // Si el usuario está autenticado, añade la información del usuario al header
  const response = NextResponse.next()
  if (authHeader) {
    response.headers.set('X-Authenticated-User', authHeader)
    if (authGroups) {
      response.headers.set('X-User-Groups', authGroups)
    }
  }

  return response
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