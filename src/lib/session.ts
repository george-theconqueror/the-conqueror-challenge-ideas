import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'ideas-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

// Session data interface
export interface SessionData {
  user?: {
    gender?: string
    age?: number
    location?: string
  }
}

// Get session data
export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

// Save session data
export async function saveSession(sessionData: Partial<SessionData>): Promise<void> {
  const session = await getSession()
  Object.assign(session, sessionData)
  // Iron Session automatically saves the session
}

// Clear session data
export async function clearSession(): Promise<void> {
  const session = await getSession()
  Object.keys(session).forEach(key => {
    delete session[key as keyof SessionData]
  })
}



// Get specific session value
export async function getSessionValue<T>(key: keyof SessionData): Promise<T | undefined> {
  const session = await getSession()
  return session[key] as T | undefined
}

// Set specific session value
export async function setSessionValue<K extends keyof SessionData>(key: K, value: SessionData[K]): Promise<void> {
  const session = await getSession()
  session[key] = value
}

// Check if session has specific data
export async function hasSessionData(key: keyof SessionData): Promise<boolean> {
  const session = await getSession()
  return session[key] !== undefined
}

// Get user data from session
export async function getUserData(): Promise<SessionData['user'] | undefined> {
  return getSessionValue('user')
}

// Set user data in session
export async function setUserData(userData: SessionData['user']): Promise<void> {
  await setSessionValue('user', userData)
}



// Utility function to redirect with session data
export async function redirectWithSession(path: string, sessionData?: Partial<SessionData>): Promise<never> {
  if (sessionData) {
    await saveSession(sessionData)
  }
  redirect(path)
}



// Client-side session utilities (for use in components)
export const clientSessionUtils = {
  // Parse URL parameters on the client side
  parseUrlParams: (url: string): Record<string, string> => {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  },
  
  // Get current URL parameters
  getCurrentUrlParams: (): Record<string, string> => {
    if (typeof window === 'undefined') return {}
    
    const params: Record<string, string> = {}
    const searchParams = new URLSearchParams(window.location.search)
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  },
  
  // Update URL without page reload
  updateUrlParams: (params: Record<string, string>, replace: boolean = true): void => {
    if (typeof window === 'undefined') return
    
    const url = new URL(window.location.href)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value)
      } else {
        url.searchParams.delete(key)
      }
    })
    
    if (replace) {
      window.history.replaceState({}, '', url.toString())
    } else {
      window.history.pushState({}, '', url.toString())
    }
  },
  
  // Remove specific URL parameters
  removeUrlParams: (paramKeys: string[]): void => {
    if (typeof window === 'undefined') return
    
    const url = new URL(window.location.href)
    
    paramKeys.forEach(key => {
      url.searchParams.delete(key)
    })
    
    window.history.replaceState({}, '', url.toString())
  }
}
