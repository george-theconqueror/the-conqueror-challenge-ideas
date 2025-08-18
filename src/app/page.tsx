import { GameLogic } from "@/components/GameLogic"
import { readUserDataFromCookies, hasUserDataInCookies } from "@/lib/cookieReader"
import { setUserData } from "@/lib/session"
import { decodeUrlParams } from "@/lib/urlObfuscation"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  // Await the searchParams Promise to get the actual parameters
  const params = await searchParams
  
  // Check if we have URL parameters and if user data doesn't already exist in cookies
  const hasExistingData = await hasUserDataInCookies()
  
  if (!hasExistingData && (params.x || params.y || params.z)) {
    // Decode obfuscated parameters for logging/debugging
    const obfuscatedParams: Record<string, string> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (['x', 'y', 'z'].includes(key) && value) {
        obfuscatedParams[key] = Array.isArray(value) ? value[0] : value
      }
    })
    
    const decodedParams = decodeUrlParams(obfuscatedParams)
    console.log('Decoded obfuscated URL parameters:', decodedParams)
  }
  
  // Read any existing user data from cookies (either from URL params or previous sessions)
  const userData = await readUserDataFromCookies()
  
  // If we have user data, also store it in the Iron Session for consistency
  if (Object.keys(userData).length > 0) {
    await setUserData(userData)
    console.log('User data loaded from cookies:', userData)
  }

  return <GameLogic />
}
