import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

// Session configuration for Iron Session
const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'ideas-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

// Interface for the data we want to store from URL parameters
interface UrlParamData {
  gender?: string
  age?: number
  location?: string
}

/**
 * Extract URL parameters and store them in HTTP-only cookies using Iron Session
 * @param searchParams - URLSearchParams object from the request
 */
export async function storeUrlParamsInCookies(searchParams: URLSearchParams): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<UrlParamData>(cookieStore, sessionOptions)
  
  // Extract parameters from URL
  const gender = searchParams.get('gender')
  const age = searchParams.get('age')
  const location = searchParams.get('location')
  
  // Update session with extracted parameters
  if (gender) session.gender = gender
  if (age) session.age = parseInt(age, 10)
  if (location) session.location = location
  
  // Iron Session automatically saves the session to cookies
}

/**
 * Get stored URL parameter data from cookies
 */
export async function getStoredUrlParams(): Promise<UrlParamData | null> {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<UrlParamData>(cookieStore, sessionOptions)
    return Object.keys(session).length > 0 ? session : null
  } catch (error) {
    console.error('Error reading session:', error)
    return null
  }
}

/**
 * Get a specific stored parameter value
 * @param key - The parameter key to retrieve
 */
export async function getStoredParam<T>(key: keyof UrlParamData): Promise<T | undefined> {
  const session = await getStoredUrlParams()
  return session?.[key] as T | undefined
}

/**
 * Clear all stored URL parameters from cookies
 */
export async function clearStoredUrlParams(): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<UrlParamData>(cookieStore, sessionOptions)
  
  // Clear all properties
  Object.keys(session).forEach(key => {
    delete session[key as keyof UrlParamData]
  })
  
  // Iron Session will automatically update the cookies
}

/**
 * Check if a specific parameter is stored
 * @param key - The parameter key to check
 */
export async function hasStoredParam(key: keyof UrlParamData): Promise<boolean> {
  const session = await getStoredUrlParams()
  return session?.[key] !== undefined
}

/**
 * Update specific parameters in the stored session
 * @param updates - Object containing parameter updates
 */
export async function updateStoredParams(updates: Partial<UrlParamData>): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<UrlParamData>(cookieStore, sessionOptions)
  
  // Apply updates
  Object.assign(session, updates)
  
  // Iron Session automatically saves the session
}

/**
 * Get all stored parameters as a query string
 * Useful for redirecting with preserved parameters
 */
export async function getStoredParamsAsQueryString(): Promise<string> {
  const session = await getStoredUrlParams()
  if (!session) return ''
  
  const params = new URLSearchParams()
  
  if (session.gender) params.set('gender', session.gender)
  if (session.age) params.set('age', session.age.toString())
  if (session.location) params.set('location', session.location)
  
  return params.toString()
}

/**
 * Check if stored parameters exist
 * Since we don't store timestamps, this just checks if any parameters are stored
 */
export async function hasStoredParams(): Promise<boolean> {
  const session = await getStoredUrlParams()
  return session !== null && Object.keys(session).length > 0
}
