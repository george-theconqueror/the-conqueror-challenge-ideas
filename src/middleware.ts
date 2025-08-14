import { NextRequest, NextResponse } from 'next/server'
import { decodeUrlParams } from '@/lib/urlObfuscation'

export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Check if we have obfuscated URL parameters to store
  const hasParams = searchParams.has('x') || searchParams.has('y') || searchParams.has('z')
  
  if (hasParams) {
    const response = NextResponse.next()
    
    // Extract obfuscated parameters
    const obfuscatedParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (['x', 'y', 'z'].includes(key)) {
        obfuscatedParams[key] = value
      }
    })
    
    // Decode the parameters back to original names
    const decodedParams = decodeUrlParams(obfuscatedParams)
    
    // Set cookies with original names (for your existing code)
    if (decodedParams.gender) {
      response.cookies.set('ideas-gender', decodedParams.gender, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    if (decodedParams.age) {
      response.cookies.set('ideas-age', decodedParams.age, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    if (decodedParams.location) {
      response.cookies.set('ideas-location', decodedParams.location, {
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
