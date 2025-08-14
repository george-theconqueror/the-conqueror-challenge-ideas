import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Check if we have URL parameters to store
  const hasParams = searchParams.has('gender') || searchParams.has('age') || searchParams.has('location')
  
  if (hasParams) {
    // Create a response to set cookies
    const response = NextResponse.next()
    
    // Extract parameters
    const gender = searchParams.get('gender')
    const age = searchParams.get('age')
    const location = searchParams.get('location')
    
    // Set cookies directly (these will be HTTP-only and secure)
    if (gender) {
      response.cookies.set('ideas-gender', gender, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    if (age) {
      response.cookies.set('ideas-age', age, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    if (location) {
      response.cookies.set('ideas-location', location, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    return response
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
