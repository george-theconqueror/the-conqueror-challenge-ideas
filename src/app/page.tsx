import { GameLogic } from "@/components/GameLogic"
import { readUserDataFromCookies, hasUserDataInCookies } from "@/lib/cookieReader"
import { setUserData } from "@/lib/session"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: PageProps) {
  // Check if we have URL parameters and if user data doesn't already exist in cookies
  const hasExistingData = await hasUserDataInCookies()
  
  if (!hasExistingData && (searchParams.gender || searchParams.age || searchParams.location)) {
    // If we have URL parameters and no existing data, the middleware will handle storing them
    // We just need to wait a moment for the middleware to process
    console.log('URL parameters detected, middleware will store them in cookies')
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
